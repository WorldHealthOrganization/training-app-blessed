import { differenceInMinutes } from "date-fns";
import _ from "lodash";
import {
    isValidTrainingType,
    TrainingModule,
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
        this.storageClient = new DataStoreStorageClient(config.getInstance());
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
        const persistedModel = await this.getDataStore(key);
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

    private async getDataStore(key: string): Promise<PersistedTrainingModule | undefined> {
        const dataStoreModule = await this.storageClient.getObjectInCollection<
            PersistedTrainingModule
        >(Namespaces.TRAINING_MODULES, key);

        return dataStoreModule ?? this.getBuiltin(key);
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
            welcome: {
                title: translate(contents.welcome.title, uiLocale),
                description: translate(contents.welcome.description, uiLocale),
                icon: translate(contents.welcome.icon, uiLocale),
            },
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
