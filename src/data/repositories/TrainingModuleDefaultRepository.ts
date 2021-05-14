import _ from "lodash";
import { defaultTrainingModule, isValidTrainingType, TrainingModule } from "../../domain/entities/TrainingModule";
import { TranslatableText } from "../../domain/entities/TranslatableText";
import { UserProgress } from "../../domain/entities/UserProgress";
import { ConfigRepository } from "../../domain/repositories/ConfigRepository";
import { InstanceRepository } from "../../domain/repositories/InstanceRepository";
import { TrainingModuleRepository } from "../../domain/repositories/TrainingModuleRepository";
import { Dictionary } from "../../types/utils";
import { swapById } from "../../utils/array";
import { promiseMap } from "../../utils/promises";
import { BuiltinModules } from "../assets/modules/BuiltinModules";
import { ImportExportClient } from "../clients/importExport/ImportExportClient";
import { DataStoreStorageClient } from "../clients/storage/DataStoreStorageClient";
import { Namespaces } from "../clients/storage/Namespaces";
import { StorageClient } from "../clients/storage/StorageClient";
import { PoEditorApi } from "../clients/translation/PoEditorApi";
import { JSONTrainingModule } from "../entities/JSONTrainingModule";
import { PersistedTrainingModule } from "../entities/PersistedTrainingModule";
import { validateUserPermission } from "../entities/User";
import { getMajorVersion } from "../utils/d2-api";

export class TrainingModuleDefaultRepository implements TrainingModuleRepository {
    private builtinModules: Dictionary<JSONTrainingModule | undefined>;
    private storageClient: StorageClient;
    private progressStorageClient: StorageClient;
    private importExportClient: ImportExportClient;

    constructor(private config: ConfigRepository, private instanceRepository: InstanceRepository) {
        //@ts-ignore FIXME: Add decoding to enforce types
        this.builtinModules = BuiltinModules;
        this.storageClient = new DataStoreStorageClient("global", config.getInstance());
        this.progressStorageClient = new DataStoreStorageClient("user", config.getInstance());
        this.importExportClient = new ImportExportClient(this.instanceRepository, "training-modules");
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
                .filter(model => validateUserPermission(model, "read", currentUser))
                .value();

            return promiseMap(modules, async persistedModel => {
                const model = await this.buildDomainModel(persistedModel);

                return {
                    ...model,
                    progress: progress?.find(({ id }) => id === model.id) ?? {
                        id: model.id,
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
            progress: progress?.find(({ id }) => id === model.id) ?? {
                id: model.id,
                lastStep: 0,
                completed: false,
            },
        };
    }

    public async update(model: Pick<TrainingModule, "id" | "name"> & Partial<TrainingModule>): Promise<void> {
        const newModule = await this.buildPersistedModel({ _version: 1, ...defaultTrainingModule, ...model });
        await this.saveDataStore(newModule);
    }

    public async import(files: File[]): Promise<PersistedTrainingModule[]> {
        return this.importExportClient.import<PersistedTrainingModule>(files, (model, options) =>
            this.saveDataStore(model, options)
        );
    }

    public async export(ids: string[]): Promise<void> {
        const modules = await promiseMap(ids, id =>
            this.storageClient.getObjectInCollection<PersistedTrainingModule>(Namespaces.TRAINING_MODULES, id)
        );

        return this.importExportClient.export(modules);
    }

    public async resetDefaultValue(ids: string[]): Promise<void> {
        for (const id of ids) {
            const defaultModule = this.builtinModules[id];
            if (defaultModule) {
                const model = await this.buildPersistedModel(defaultModule);
                await this.saveDataStore(model);
            }
        }
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

        const newItems = swapById(items, id1, id2);
        await this.storageClient.saveObject(Namespaces.TRAINING_MODULES, newItems);
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

    public async saveDataStore(model: PersistedTrainingModule, options?: { recreate?: boolean }) {
        const currentUser = await this.config.getUser();
        const user = { id: currentUser.id, name: currentUser.name };
        const date = new Date().toISOString();

        await this.storageClient.saveObjectInCollection<PersistedTrainingModule>(Namespaces.TRAINING_MODULES, {
            ...model,
            lastUpdatedBy: user,
            lastUpdated: date,
            user: options?.recreate ? user : model.user,
            created: options?.recreate ? date : model.created,
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

        const { created, lastUpdated, type, contents, ...rest } = model;
        const validType = isValidTrainingType(type) ? type : "app";
        const currentUser = await this.config.getUser();
        const instanceVersion = await this.instanceRepository.getVersion();

        return {
            ...rest,
            contents: {
                ...contents,
                steps: contents.steps.map((step, stepIdx) => ({
                    ...step,
                    id: `${model.id}-step-${stepIdx}`,
                    pages: step.pages.map((page, pageIdx) => ({
                        ...page,
                        id: `${model.id}-page-${stepIdx}-${pageIdx}`,
                    })),
                })),
            },
            installed: await this.instanceRepository.isAppInstalledByUrl(model.dhisLaunchUrl),
            editable: validateUserPermission(model, "write", currentUser),
            compatible: validateDhisVersion(model, instanceVersion),
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

function validateDhisVersion(model: PersistedTrainingModule, instanceVersion: string): boolean {
    const moduleVersions = _.compact(model.dhisVersionRange.split(","));
    if (moduleVersions.length === 0) return true;

    return _.some(moduleVersions, version => getMajorVersion(version) === getMajorVersion(instanceVersion));
}
