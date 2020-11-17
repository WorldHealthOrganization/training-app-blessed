import { differenceInMinutes } from "date-fns";
import _ from "lodash";
import { Either } from "../../domain/entities/Either";
import {
    isValidTrainingType,
    TrainingModule,
    TrainingModuleBuilder,
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
import { UserProgress } from "../entities/UserProgress";
import { ConfigRepository } from "../../domain/repositories/ConfigRepository";
import { PoEditorTranslationClient } from "../clients/translation/PoEditorTranslationClient";
import { TranslationClient } from "../clients/translation/TranslationClient";

export class TrainingModuleDefaultRepository implements TrainingModuleRepository {
    private builtinModules: Dictionary<JSONTrainingModule | undefined>;
    private storageClient: StorageClient;
    private progressStorageClient: StorageClient;

    constructor(private config: ConfigRepository) {
        this.builtinModules = BuiltinModules;
        this.storageClient = new DataStoreStorageClient("global", config.getInstance());
        this.progressStorageClient = new DataStoreStorageClient("user", config.getInstance());
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

        const translatedModel = await this.updateTranslations(persistedModel);
        return this.buildDomainModel(translatedModel);
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

    public async updateProgress(id: string, progress: number): Promise<void> {
        const percentage = Math.max(Math.min(progress, 100), 0);
        await this.progressStorageClient.saveObjectInCollection<UserProgress>(Namespaces.PROGRESS, {
            id,
            percentage,
        });
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
        if (model.translation.provider === "NONE") return model;
        const translationClient = await this.getTranslationClient();
        console.log(translationClient);

        const lastTranslationSync = new Date(model.lastTranslationSync);
        if (Math.abs(differenceInMinutes(new Date(), lastTranslationSync)) < 15) {
            return model;
        }

        // Update terms in poeditor
        // Fetch translations and update local model

        return model;
    }

    // TODO: Implement multiple providers (other than poeditor)
    private async getTranslationClient(): Promise<TranslationClient | undefined> {
        const token = await this.config.getPoEditorToken();
        return token ? new PoEditorTranslationClient(token) : undefined;
    }

    private async buildDomainModel(model: PersistedTrainingModule): Promise<TrainingModule> {
        if (model._version !== 1) {
            throw new Error(`Unsupported revision of module: ${model._version}`);
        }

        const { created, lastUpdated, type, ...rest } = model;
        const validType = isValidTrainingType(type) ? type : "app";

        const progress = await this.progressStorageClient.getObjectInCollection<UserProgress>(
            Namespaces.PROGRESS,
            model.id
        );

        return {
            ...rest,
            created: new Date(created),
            lastUpdated: new Date(lastUpdated),
            type: validType,
            progress: progress?.percentage ?? 0,
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
