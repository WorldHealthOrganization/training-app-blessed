import _ from "lodash";
import { defaultTrainingModule, isValidTrainingType, TrainingModule } from "../../domain/entities/TrainingModule";
import { TranslatableText } from "../../domain/entities/TranslatableText";
import { UserProgress } from "../../domain/entities/UserProgress";
import { ConfigRepository } from "../../domain/repositories/ConfigRepository";
import { InstanceRepository } from "../../domain/repositories/InstanceRepository";
import { TrainingModuleRepository } from "../../domain/repositories/TrainingModuleRepository";
import { Dictionary } from "../../types/utils";
import { promiseMap } from "../../utils/promises";
import { BuiltinModules } from "../assets/modules/BuiltinModules";
import { DataStoreStorageClient } from "../clients/storage/DataStoreStorageClient";
import { Namespaces } from "../clients/storage/Namespaces";
import { StorageClient } from "../clients/storage/StorageClient";
import { PoEditorApi } from "../clients/translation/PoEditorApi";
import { JSONTrainingModule } from "../entities/JSONTrainingModule";
import { PersistedTrainingModule } from "../entities/PersistedTrainingModule";

export class TrainingModuleDefaultRepository implements TrainingModuleRepository {
    private builtinModules: Dictionary<JSONTrainingModule | undefined>;
    private storageClient: StorageClient;
    private progressStorageClient: StorageClient;

    constructor(private config: ConfigRepository, private instanceRepository: InstanceRepository) {
        //@ts-ignore FIXME: Add decoding to enforce types
        this.builtinModules = BuiltinModules;
        this.storageClient = new DataStoreStorageClient("global", config.getInstance());
        this.progressStorageClient = new DataStoreStorageClient("user", config.getInstance());
    }

    public async list(): Promise<TrainingModule[]> {
        try {
            const dataStoreModules = await this.storageClient.listObjectsInCollection<PersistedTrainingModule>(
                Namespaces.TRAINING_MODULES
            );

            const missingModuleKeys = _(this.builtinModules)
                .values()
                .compact()
                .differenceBy(dataStoreModules, ({ id, revision }: JSONTrainingModule) => [id, revision].join("-"))
                .map(({ id }) => id)
                .value();

            const missingModules = await promiseMap(missingModuleKeys, key => this.createBuiltin(key));

            const progress = await this.progressStorageClient.getObject<UserProgress[]>(Namespaces.PROGRESS);

            const currentUser = await this.config.getUser();

            const modules = _([...dataStoreModules, ...missingModules])
                .compact()
                .uniqBy("id")
                .filter(({ dhisAuthorities }) => {
                    const userAuthorities = currentUser.userRoles.flatMap(({ authorities }) => authorities);

                    return _.every(
                        dhisAuthorities,
                        authority => userAuthorities.includes("ALL") || userAuthorities.includes(authority)
                    );
                })
                .value();

            return promiseMap(modules, async module => {
                const model = await this.buildDomainModel(module);

                return {
                    ...model,
                    progress: progress?.find(({ id }) => id === module.id) ?? {
                        id: module.id,
                        lastStep: 0,
                        completed: false,
                    },
                };
            });
        } catch (error) {
            return [];
        }
    }

    public async get(key: string): Promise<TrainingModule | undefined> {
        const dataStoreModel = await this.storageClient.getObjectInCollection<PersistedTrainingModule>(
            Namespaces.TRAINING_MODULES,
            key
        );

        const model = dataStoreModel ?? (await this.createBuiltin(key));
        if (!model) return undefined;

        const progress = await this.progressStorageClient.getObject<UserProgress[]>(Namespaces.PROGRESS);

        const domainModel = await this.buildDomainModel(model);

        return {
            ...domainModel,
            progress: progress?.find(({ id }) => id === module.id) ?? {
                id: module.id,
                lastStep: 0,
                completed: false,
            },
        };
    }

    public async update(module: Pick<TrainingModule, "id" | "name"> & Partial<TrainingModule>): Promise<void> {
        const newModule = await this.buildPersistedModel({ _version: 1, ...defaultTrainingModule, ...module });
        await this.saveDataStore(newModule);
    }
    public async resetDefaultValue(id: string): Promise<void> {
        const defaultModule = this.builtinModules[id];
        if (!defaultModule) return;

        const module = await this.buildPersistedModel(defaultModule);
        await this.saveDataStore(module);
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

        const item1 = items[_.findIndex(items, ({ id }) => id === id1)];
        const item2 = items[_.findIndex(items, ({ id }) => id === id2)];
        if (!item1 || !item2) return;

        items[index1] = item2;
        items[index2] = item1;

        await this.storageClient.saveObject(Namespaces.TRAINING_MODULES, items);
    }

    public async updateProgress(id: string, lastStep: number, completed: boolean): Promise<void> {
        await this.progressStorageClient.saveObjectInCollection<UserProgress>(Namespaces.PROGRESS, {
            id,
            lastStep,
            completed,
        });
    }

    public async updateTranslations(key: string): Promise<void> {
        try {
            const token = await this.config.getPoEditorToken();
            const model = await this.storageClient.getObjectInCollection<PersistedTrainingModule>(
                Namespaces.TRAINING_MODULES,
                key
            );

            if (!model || model.translation.provider === "NONE" || !token) return;
            const api = new PoEditorApi(token);
            const project = parseInt(model.translation.project);

            // Fetch translations and update local model
            const languagesResponse = await api.languages.list({ id: project });
            const poeditorLanguages = languagesResponse.value.data?.languages.map(({ code }) => code) ?? [];

            const dictionary = _(
                await promiseMap(poeditorLanguages, async language => {
                    const translationResponse = await api.terms.list({ id: project, language });
                    return (
                        translationResponse.value.data?.terms.map(({ term, translation }) => ({
                            term,
                            language,
                            value: translation.content,
                        })) ?? []
                    );
                })
            )
                .flatten()
                .groupBy(item => item.term)
                .mapValues(items => _.fromPairs(items.map(({ language, value }) => [language, value])))
                .value();

            const translatedModel: PersistedTrainingModule = {
                ...model,
                name: {
                    ...model.name,
                    translations: dictionary[model.name.key] ?? {},
                },
                contents: {
                    ...model.contents,
                    welcome: {
                        ...model.contents.welcome,
                        translations: dictionary[model.contents.welcome.key] ?? {},
                    },
                    steps: model.contents.steps.map(step => ({
                        ...step,
                        title: {
                            ...step.title,
                            translations: dictionary[step.title.key] ?? {},
                        },
                        subtitle: step.subtitle
                            ? {
                                  ...step.subtitle,
                                  translations: dictionary[step.subtitle.key] ?? {},
                              }
                            : undefined,
                        pages: step.pages.map(page => ({
                            ...page,
                            translations: dictionary[page.key] ?? {},
                        })),
                    })),
                },
            };

            await this.saveDataStore(translatedModel);
        } catch (error) {
            console.error(error);
        }
    }

    public async initializeTranslation(key: string): Promise<void> {
        const token = await this.config.getPoEditorToken();
        const builtInModule = this.builtinModules[key];
        if (!builtInModule) return;
        const model = await this.buildPersistedModel(builtInModule);

        if (!model || model.translation.provider === "NONE" || !token) return;
        const api = new PoEditorApi(token);
        const project = parseInt(model.translation.project);

        const translatableItems = this.extractTranslations(model);

        const terms = translatableItems.map(item => ({ term: item.key }));
        const referenceTranslations = translatableItems.map(item => ({
            term: item.key,
            translation: { content: item.referenceValue },
        }));

        // Update terms
        await api.terms.add({ id: project, data: JSON.stringify(terms) });

        // Update reference values
        await api.languages.add({ id: project, language: "en" });
        await api.languages.update({
            id: project,
            language: "en",
            data: JSON.stringify(referenceTranslations),
            fuzzy_trigger: 1,
        });

        // Update reference language
        await api.projects.update({ id: project, reference_language: "en" });
    }

    private extractTranslations(model: PersistedTrainingModule): TranslatableText[] {
        const steps = _.flatMap(model.contents.steps, step => [step.title, step.subtitle, ...step.pages]);

        return _.compact([model.name, model.contents.welcome, ...steps]);
    }

    private async createBuiltin(key: string): Promise<PersistedTrainingModule | undefined> {
        const builtinModule = this.builtinModules[key];
        if (!builtinModule) return undefined;

        const persistedModel = await this.buildPersistedModel(builtinModule);
        await this.saveDataStore(persistedModel);

        return persistedModel;
    }

    private async saveDataStore(model: PersistedTrainingModule) {
        const currentUser = await this.config.getUser();
        const lastUpdatedBy = { id: currentUser.id, name: currentUser.name };

        await this.storageClient.saveObjectInCollection<PersistedTrainingModule>(Namespaces.TRAINING_MODULES, {
            ...model,
            lastUpdated: new Date().toISOString(),
            lastUpdatedBy,
        });
    }

    /** TODO: Implement multiple providers (other than poeditor)
    private async getTranslationClient(): Promise<TranslationClient | undefined> {
        const token = await this.config.getPoEditorToken();
        return token ? new PoEditorTranslationClient(token) : undefined;
    }
    */

    private async buildDomainModel(model: PersistedTrainingModule): Promise<Omit<TrainingModule, "progress">> {
        if (model._version !== 1) {
            throw new Error(`Unsupported revision of module: ${model._version}`);
        }

        const { created, lastUpdated, type, ...rest } = model;
        const validType = isValidTrainingType(type) ? type : "app";

        return {
            ...rest,
            installed: await this.instanceRepository.isAppInstalledByUrl(model.dhisLaunchUrl),
            created: new Date(created),
            lastUpdated: new Date(lastUpdated),
            type: validType,
        };
    }

    private async buildPersistedModel(model: JSONTrainingModule): Promise<PersistedTrainingModule> {
        const currentUser = await this.config.getUser();
        const defaultUser = { id: currentUser.id, name: currentUser.name };

        return {
            created: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            publicAccess: "--------",
            userAccesses: [],
            userGroupAccesses: [],
            user: defaultUser,
            lastUpdatedBy: defaultUser,
            lastTranslationSync: new Date().toISOString(),
            ...model,
        };
    }
}
