import {
    isValidTrainingType,
    TrainingModule,
    TrainingModuleContents,
} from "../../domain/entities/TrainingModule";
import { TrainingModuleRepository } from "../../domain/repositories/TrainingModuleRepository";
import { Dictionary } from "../../types/utils";
import { BuiltinModules } from "../assets/modules/BuiltinModules";
import { DataStoreStorageClient } from "../clients/storage/DataStoreStorageClient";
import { Namespaces } from "../clients/storage/Namespaces";
import { StorageClient } from "../clients/storage/StorageClient";
import { JSONTrainingModule, PersistentTrainingModule } from "../entities/JSONTrainingModule";
import { translate } from "../entities/TranslatableText";
import { ConfigDataSource } from "../sources/config/ConfigDataSource";

export class TrainingModuleDefaultRepository implements TrainingModuleRepository {
    private builtinModules: Dictionary<JSONTrainingModule | undefined>;
    private storageClient: StorageClient;

    constructor(private config: ConfigDataSource) {
        this.builtinModules = BuiltinModules;
        this.storageClient = new DataStoreStorageClient(config.getInstance());
    }

    public async get(moduleKey: string): Promise<TrainingModule | undefined> {
        const dataStoreModule = await this.storageClient.getObjectInCollection<
            PersistentTrainingModule
        >(Namespaces.TRAINING_MODULES, moduleKey);
        if (dataStoreModule) return this.buildDomainModel(dataStoreModule);

        const builtinModule = this.builtinModules[moduleKey];
        if (!builtinModule) return undefined;

        const persistedModel = await this.buildPersistedModel(builtinModule);
        await this.saveDataStore(persistedModel);

        return this.buildDomainModel(persistedModel);
    }

    private async saveDataStore(dataStoreModule: PersistentTrainingModule) {
        await this.storageClient.saveObjectInCollection(
            Namespaces.TRAINING_MODULES,
            dataStoreModule
        );
    }

    private async buildDomainModel(model: PersistentTrainingModule): Promise<TrainingModule> {
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
        };
    }

    private async buildPersistedModel(
        model: JSONTrainingModule
    ): Promise<PersistentTrainingModule> {
        const currentUser = await this.config.getUser();
        const defaultUser = { id: currentUser.id, name: currentUser.name };

        return {
            ...model,
            created: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            publicAccess: "--------",
            userAccesses: [],
            userGroupAccesses: [],
            user: defaultUser,
            lastUpdatedBy: defaultUser,
        };
    }
}
