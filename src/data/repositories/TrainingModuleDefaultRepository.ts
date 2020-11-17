import { differenceInMinutes } from "date-fns";
import _ from "lodash";
import { Either } from "../../domain/entities/Either";
import {
    isValidTrainingType,
    TrainingModule,
    TrainingModuleBuilder,
    TrainingModuleContents,
} from "../../domain/entities/TrainingModule";
import { TrainingModuleRepository } from "../../domain/repositories/TrainingModuleRepository";
import { Dictionary } from "../../types/utils";
import { promiseMap } from "../../utils/promises";
import { BuiltinModules } from "../assets/modules/BuiltinModules";
import { DataStoreStorageClient } from "../clients/storage/DataStoreStorageClient";
import { Namespaces } from "../clients/storage/Namespaces";
import { StorageClient } from "../clients/storage/StorageClient";
import { JSONTrainingModule } from "../entities/JSONTrainingModule";
import { PersistedTrainingModule } from "../entities/PersistedTrainingModule";
import { translate } from "../entities/TranslatableText";
import { ConfigDataSource } from "../sources/config/ConfigDataSource";

export class TrainingModuleDefaultRepository implements TrainingModuleRepository {
    private builtinModules: Dictionary<JSONTrainingModule | undefined>;
    private storageClient: StorageClient;

    constructor(private config: ConfigDataSource) {
        this.builtinModules = BuiltinModules;
        this.storageClient = new DataStoreStorageClient("global", config.getInstance());
    }

    public async list(): Promise<TrainingModule[]> {
        const dataStoreModules = await this.storageClient.listObjectsInCollection<
            PersistedTrainingModule
        >(Namespaces.TRAINING_MODULES);

        const missingModuleKeys = _(this.builtinModules)
            .keys()
            .difference(dataStoreModules.map(({ id }) => id))
            .value();

        const missingModules = await promiseMap(missingModuleKeys, key => this.getBuiltin(key));

        return promiseMap(_.compact([...dataStoreModules, ...missingModules]), module =>
            this.buildDomainModel(module)
        );
    }

    public async get(key: string): Promise<TrainingModule | undefined> {
        const dataStoreModel = await this.storageClient.getObjectInCollection<
            PersistedTrainingModule
        >(Namespaces.TRAINING_MODULES, key);

        const persistedModel = dataStoreModel ?? (await this.getBuiltin(key));
        if (!persistedModel) return undefined;

        // TODO: Add new property, lastTranslationSync
        const lastTranslationSync = new Date(persistedModel.lastTranslationSync);
        if (Math.abs(differenceInMinutes(new Date(), lastTranslationSync)) > 15) {
            const updatedModel = await this.updateTranslations(persistedModel);
            await this.saveDataStore(updatedModel);
            return this.buildDomainModel(updatedModel);
        }

        return this.buildDomainModel(persistedModel);
    }

    public async create({
        id,
        name,
        welcome,
    }: TrainingModuleBuilder): Promise<Either<"CODE_EXISTS", void>> {
        const items = await this.storageClient.listObjectsInCollection<PersistedTrainingModule>(
            Namespaces.TRAINING_MODULES
        );
        const exists = !!items.find(item => item.id === id);
        if (exists) return Either.error("CODE_EXISTS");

        const newModel = await this.buildPersistedModel({
            id,
            name,
            type: "app",
            _version: 1,
            revision: 1,
            dhisVersionRange: "",
            dhisAppKey: "",
            dhisLaunchUrl: "",
            disabled: false,
            contents: {
                welcome: { key: "module-welcome", referenceValue: welcome, translations: {} },
                steps: [],
            },
        });

        await this.saveDataStore(newModel);
        return Either.success(undefined);
    }

    public async edit({ id, name, welcome }: TrainingModuleBuilder): Promise<void> {
        const items = await this.storageClient.listObjectsInCollection<PersistedTrainingModule>(
            Namespaces.TRAINING_MODULES
        );
        const item = items.find(item => item.id === id);
        if (!item) return;

        const newItem = {
            ...item,
            name: name,
            contents: {
                ...item.contents,
                welcome: {
                    ...item.contents.welcome,
                    referenceValue: welcome,
                },
            },
        };

        await this.storageClient.saveObjectInCollection(Namespaces.TRAINING_MODULES, newItem);
    }

    public async delete(ids: string[]): Promise<void> {
        for (const id of ids) {
            await this.storageClient.removeObjectInCollection(Namespaces.TRAINING_MODULES, id);
        }
    }

    public async swapOrder(id1: string, id2: string): Promise<void> {
        const items = await this.storageClient.listObjectsInCollection<PersistedTrainingModule>(
            Namespaces.TRAINING_MODULES
        );

        const index1 = _.findIndex(items, ({ id }) => id === id1);
        const index2 = _.findIndex(items, ({ id }) => id === id2);
        if (index1 === -1 || index2 === -1) return;

        [items[index1], items[index2]] = [items[index2], items[index1]];
        await this.storageClient.saveObject(Namespaces.TRAINING_MODULES, items);
    }

    private async getBuiltin(key: string): Promise<PersistedTrainingModule | undefined> {
        const builtinModule = this.builtinModules[key];
        if (!builtinModule) return undefined;

        const persistedModel = await this.buildPersistedModel(builtinModule);
        await this.saveDataStore(persistedModel);

        return persistedModel;
    }

    private async saveDataStore(model: PersistedTrainingModule) {
        const currentUser = await this.config.getUser();
        const lastUpdatedBy = { id: currentUser.id, name: currentUser.name };

        await this.storageClient.saveObjectInCollection(Namespaces.TRAINING_MODULES, {
            ...model,
            lastUpdated: new Date(),
            lastUpdatedBy,
        });
    }

    private async updateTranslations(
        model: PersistedTrainingModule
    ): Promise<PersistedTrainingModule> {
        console.log("TODO: Update translations");
        return model;
    }

    private async buildDomainModel(model: PersistedTrainingModule): Promise<TrainingModule> {
        if (model._version !== 1) {
            throw new Error(`Unsupported revision of module: ${model._version}`);
        }

        const { created, lastUpdated, type, contents, ...rest } = model;
        const { uiLocale } = await this.config.getUser();
        const validType = isValidTrainingType(type) ? type : "app";

        const translatedContents: TrainingModuleContents = {
            welcome: translate(contents.welcome, uiLocale),
            steps: contents.steps.map(({ title, subtitle, pages }) => ({
                title: translate(title, uiLocale),
                subtitle: subtitle ? translate(subtitle, uiLocale) : undefined,
                pages: pages.map(item => translate(item, uiLocale)),
            })),
        };

        return {
            ...rest,
            created: new Date(created),
            lastUpdated: new Date(lastUpdated),
            contents: translatedContents,
            type: validType,
            progress: 0,
        };
    }

    private async buildPersistedModel(model: JSONTrainingModule): Promise<PersistedTrainingModule> {
        const currentUser = await this.config.getUser();
        const defaultUser = { id: currentUser.id, name: currentUser.name };

        return {
            ...model,
            translation: { provider: "NONE" },
            created: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            publicAccess: "--------",
            userAccesses: [],
            userGroupAccesses: [],
            user: defaultUser,
            lastUpdatedBy: defaultUser,
            lastTranslationSync: new Date().toISOString(),
        };
    }
}
