import FileSaver from "file-saver";
import JSZip from "jszip";
import _ from "lodash";
import { defaultTrainingModule, isValidTrainingType, TrainingModule } from "../../domain/entities/TrainingModule";
import { TranslatableText } from "../../domain/entities/TranslatableText";
import { UserProgress } from "../../domain/entities/UserProgress";
import { ConfigRepository } from "../../domain/repositories/ConfigRepository";
import { InstanceRepository } from "../../domain/repositories/InstanceRepository";
import { TrainingModuleRepository } from "../../domain/repositories/TrainingModuleRepository";
import { swapById } from "../../utils/array";
import { cache } from "../../utils/cache";
import { promiseMap } from "../../utils/promises";
import { FetchHttpClient } from "../clients/http/FetchHttpClient";
import { HttpClient } from "../clients/http/HttpClient";
import { ImportExportClient } from "../clients/importExport/ImportExportClient";
import { DataStoreStorageClient } from "../clients/storage/DataStoreStorageClient";
import { Namespaces } from "../clients/storage/Namespaces";
import { StorageClient } from "../clients/storage/StorageClient";
import { JSONTrainingModule } from "../entities/JSONTrainingModule";
import { PersistedTrainingModule } from "../entities/PersistedTrainingModule";
import { validateUserPermission } from "../entities/User";
import { getMajorVersion } from "../utils/d2-api";

export class TrainingModuleDefaultRepository implements TrainingModuleRepository {
    private storageClient: StorageClient;
    private progressStorageClient: StorageClient;
    private importExportClient: ImportExportClient;
    private assetClient: HttpClient;

    constructor(private config: ConfigRepository, private instanceRepository: InstanceRepository) {
        this.storageClient = new DataStoreStorageClient("global", config.getInstance());
        this.progressStorageClient = new DataStoreStorageClient("user", config.getInstance());
        this.importExportClient = new ImportExportClient(this.instanceRepository, "training-modules");
        this.assetClient = new FetchHttpClient({});
    }

    public async list(): Promise<TrainingModule[]> {
        try {
            const currentUser = await this.config.getUser();
            const progress = await this.progressStorageClient.getObject<UserProgress[]>(Namespaces.PROGRESS);
            const dataStoreModules = await this.storageClient.listObjectsInCollection<PersistedTrainingModule>(
                Namespaces.TRAINING_MODULES
            );

            const defaultModules = await this.listDefaultModules();

            const missingModuleKeys = _.difference(
                defaultModules.map(({ id }) => id),
                dataStoreModules.map(({ id }) => id)
            );

            const [outdatedModules, updatableModules] = _(dataStoreModules)
                .filter(({ id, revision }) => {
                    const builtIn = defaultModules.find(item => item.id === id);
                    return !!builtIn && builtIn.revision > revision;
                })
                .partition(({ dirty }) => dirty)
                .value();

            const missingModules = await promiseMap(
                [...missingModuleKeys, ...updatableModules.map(({ id }) => id)],
                key => this.importDefaultModule(key)
            );

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
                    outdated: !!outdatedModules.find(({ id }) => model.id === id),
                    builtin: !!defaultModules.find(({ id }) => model.id === id),
                    progress: progress?.find(({ id }) => id === model.id) ?? {
                        id: model.id,
                        lastStep: 0,
                        completed: false,
                    },
                };
            });
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    public async get(key: string): Promise<TrainingModule | undefined> {
        const defaultModules = await this.listDefaultModules();
        const dataStoreModel = await this.storageClient.getObjectInCollection<PersistedTrainingModule>(
            Namespaces.TRAINING_MODULES,
            key
        );

        const model = dataStoreModel ?? (await this.importDefaultModule(key));
        if (!model) return undefined;

        const progress = await this.progressStorageClient.getObject<UserProgress[]>(Namespaces.PROGRESS);

        const domainModel = await this.buildDomainModel(model);

        const defaultModule = defaultModules.find(({ id }) => model.id === id);
        const outdated = !!defaultModule && defaultModule.revision > model.revision;

        return {
            ...domainModel,
            outdated,
            builtin: !!defaultModule,
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

    public async import(files: Blob[]): Promise<PersistedTrainingModule[]> {
        const items = await this.importExportClient.import<PersistedTrainingModule>(files);
        await promiseMap(items, module => this.saveDataStore(module, { recreate: true }));

        return items;
    }

    public async export(ids: string[]): Promise<void> {
        const modules = await promiseMap(ids, id =>
            this.storageClient.getObjectInCollection<PersistedTrainingModule>(Namespaces.TRAINING_MODULES, id)
        );

        return this.importExportClient.export(modules);
    }

    public async resetDefaultValue(ids: string[]): Promise<void> {
        for (const id of ids) {
            await this.importDefaultModule(id);
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

    public async exportTranslations(key: string): Promise<void> {
        const model = await this.storageClient.getObjectInCollection<PersistedTrainingModule>(
            Namespaces.TRAINING_MODULES,
            key
        );
        if (!model) throw new Error(`Module ${key} not found`);

        const translations = await this.extractTranslations(model);
        const files = _.toPairs(translations);
        const zip = new JSZip();

        for (const [lang, contents] of files) {
            const json = JSON.stringify(contents, null, 4);
            const blob = new Blob([json], { type: "application/json" });
            zip.file(`${lang}.json`, blob);
        }

        const blob = await zip.generateAsync({ type: "blob" });
        const moduleName = _.kebabCase(model.name.referenceValue);
        FileSaver.saveAs(blob, `translations-${moduleName}.zip`);
    }

    public async importTranslations(key: string, language: string, terms: Record<string, string>): Promise<number> {
        const model = await this.storageClient.getObjectInCollection<PersistedTrainingModule>(
            Namespaces.TRAINING_MODULES,
            key
        );
        if (!model) throw new Error(`Module ${key} not found`);

        const translate = <T extends TranslatableText>(item: T, language: string, term: string | undefined): T => {
            if (term === undefined) {
                return item;
            } else if (language === "en") {
                return { ...item, referenceValue: term };
            } else {
                return { ...item, translations: { ...item.translations, [language]: term } };
            }
        };

        const translatedModel: PersistedTrainingModule = {
            ...model,
            name: translate(model.name, language, terms[model.name.key]),
            contents: {
                ...model.contents,
                welcome: translate(model.contents.welcome, language, terms[model.contents.welcome.key]),
                steps: model.contents.steps.map(step => ({
                    ...step,
                    title: translate(step.title, language, terms[step.title.key]),
                    subtitle: step.subtitle ? translate(step.subtitle, language, terms[step.subtitle.key]) : undefined,
                    pages: step.pages.map(page => translate(page, language, terms[page.key])),
                })),
            },
        };

        await this.saveDataStore(translatedModel);

        const translations = await this.extractTranslations(model);
        return _.intersection(_.keys(translations["en"]), _.keys(terms)).length;
    }

    private async extractTranslations(model: PersistedTrainingModule): Promise<Record<string, Record<string, string>>> {
        const texts = _.compact([
            model.name,
            model.contents.welcome,
            ..._.flatMap(model.contents.steps, step => [step.title, step.subtitle, ...step.pages]),
        ]);

        const referenceStrings = _.fromPairs(texts.map(({ key, referenceValue }) => [key, referenceValue]));
        const translatedStrings = _(texts)
            .flatMap(({ key, translations }) => _.toPairs(translations).map(([lang, value]) => ({ lang, key, value })))
            .groupBy("lang")
            .mapValues(array => _.fromPairs(array.map(({ key, value }) => [key, value])))
            .value();

        return { ...translatedStrings, en: referenceStrings };
    }

    @cache()
    private async listDefaultModules(): Promise<DefaultModule[]> {
        try {
            const blob = await this.assetClient.request<Blob>({ method: "get", url: `/modules/config.json` }).getData();
            const text = await blob.text();

            const { modules } = JSON.parse(text);
            return modules;
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    private async importDefaultModule(id: string): Promise<PersistedTrainingModule | undefined> {
        const defaultModules = await this.listDefaultModules();
        const defaultModule = defaultModules.find(item => item.id === id);
        if (!defaultModule) return undefined;

        try {
            const blob = await this.assetClient.request<Blob>({ method: "get", url: `/modules/${id}.zip` }).getData();
            const modules = await this.importExportClient.import<PersistedTrainingModule>([blob]);
            await promiseMap(modules, module =>
                this.saveDataStore(module, { recreate: true, revision: defaultModule.revision })
            );

            return modules[0];
        } catch (error) {
            // Module not found
            return undefined;
        }
    }

    private async saveDataStore(model: PersistedTrainingModule, options?: { recreate?: boolean; revision?: number }) {
        const currentUser = await this.config.getUser();
        const user = { id: currentUser.id, name: currentUser.name };
        const date = new Date().toISOString();

        await this.storageClient.saveObjectInCollection<PersistedTrainingModule>(Namespaces.TRAINING_MODULES, {
            _version: model._version,
            id: model.id,
            name: model.name,
            icon: model.icon,
            type: model.type,
            disabled: model.disabled,
            contents: model.contents,
            revision: options?.revision ?? model.revision,
            dhisVersionRange: model.dhisVersionRange,
            dhisAppKey: model.dhisAppKey,
            dhisLaunchUrl: model.dhisLaunchUrl,
            dhisAuthorities: model.dhisAuthorities,
            publicAccess: model.publicAccess,
            userAccesses: model.userAccesses,
            userGroupAccesses: model.userGroupAccesses,
            lastUpdatedBy: user,
            lastUpdated: date,
            user: options?.recreate ? user : model.user,
            created: options?.recreate ? date : model.created,
            dirty: !options?.recreate,
        });
    }

    private async buildDomainModel(
        model: PersistedTrainingModule
    ): Promise<Omit<TrainingModule, "progress" | "outdated" | "builtin">> {
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
            dirty: true,
            ...model,
        };
    }
}

function validateDhisVersion(model: PersistedTrainingModule, instanceVersion: string): boolean {
    const moduleVersions = _.compact(model.dhisVersionRange.split(","));
    if (moduleVersions.length === 0) return true;

    return _.some(moduleVersions, version => getMajorVersion(version) === getMajorVersion(instanceVersion));
}

interface DefaultModule {
    id: string;
    revision: number;
}
