import FileSaver from "file-saver";
import JSZip from "jszip";
import _ from "lodash";
import moment from "moment";
import { InstanceRepository } from "../../domain/repositories/InstanceRepository";
import { fromPairs } from "../../types/utils";
import { getUid } from "../../utils/dhis2";
import { promiseMap } from "../../utils/promises";
import { Namespaces } from "../clients/storage/Namespaces";
import { StorageClient } from "../clients/storage/StorageClient";
import { getUrls, PersistedTrainingModule, replaceUrls } from "../entities/PersistedTrainingModule";
import { TrainingModuleDefaultRepository } from "./TrainingModuleDefaultRepository";

export type Mapping = MappingItem[];

export interface MappingItem {
    url: string;
    filename: string;
    type: string;
}

export class TrainingModuleDefaultImportExport {
    exportConfig = {
        modulePrefix: "module-",
        filesMapper: "files.json",
        filesFolder: "files",
    };

    constructor(
        private trainingModuleRepository: TrainingModuleDefaultRepository,
        private instanceRepository: InstanceRepository,
        private storageClient: StorageClient
    ) {}

    public async import(files: File[]): Promise<PersistedTrainingModule[]> {
        const modules = await promiseMap(files, async file => {
            const zip = new JSZip();
            const contents = await zip.loadAsync(file);
            const mapping = await this.getJsonFromFile<Mapping>(zip, this.exportConfig.filesMapper);
            const fileContents = await this.getFileContents(contents);
            const urlMapping = await this.getUrlMapping(fileContents, mapping);
            const modulePaths = this.getModulePaths(contents);

            return promiseMap(modulePaths, async modulePath => {
                const module = await this.getJsonFromFile<PersistedTrainingModule>(zip, modulePath);
                if (!module) return;
                const moduleWithMappedUrls = replaceUrls(module, urlMapping);
                await this.trainingModuleRepository.saveDataStore(moduleWithMappedUrls);
                return moduleWithMappedUrls;
            });
        });

        return _.compact(_.flatten(modules));
    }
    public async export(ids: string[]): Promise<void> {
        const zip = new JSZip();

        const modules = await promiseMap(ids, async id => {
            const dataStoreModel = await this.storageClient.getObjectInCollection<PersistedTrainingModule>(
                Namespaces.TRAINING_MODULES,
                id
            );

            if (!dataStoreModel) return;

            const name = _.kebabCase(this.exportConfig.modulePrefix + dataStoreModel.name.referenceValue);
            this.addJsonToZip(zip, name + ".json", dataStoreModel);
            return dataStoreModel;
        });

        await this.addFiles(_.compact(modules), zip);

        const blob = await zip.generateAsync({ type: "blob" });
        const date = moment().format("YYYYMMDDHHmm");
        FileSaver.saveAs(blob, `training-modules-${date}.zip`);
    }

    private async addFiles(modules: PersistedTrainingModule[], zip: JSZip) {
        const urls = _(modules).flatMap(getUrls).uniq().value();
        const files = await this.getFiles(urls, this.instanceRepository.baseUrl);

        const filesFolder = _(files).isEmpty() ? null : zip.folder(this.exportConfig.filesFolder);

        if (filesFolder) {
            const mapping = files.map(({ url, blob }, idx) => {
                const filename = _.padStart(idx.toString(), 5, "0");
                filesFolder.file(filename, blob);
                return { url, filename, type: blob.type };
            });

            this.addJsonToZip(zip, this.exportConfig.filesMapper, mapping);
        }
    }

    /* Private methods */

    private getModulePaths(contents: JSZip) {
        return _(contents.files)
            .pickBy((_zip, path) => path.startsWith(this.exportConfig.modulePrefix))
            .keys()
            .compact()
            .value();
    }

    private async getUrlMapping(
        fileContents: { filename: string; arrayBuffer: ArrayBuffer }[],
        mapping: Mapping | undefined
    ) {
        const fileUrlByFilename = fromPairs(
            await promiseMap(fileContents, async ({ filename, arrayBuffer }) => {
                const fileData = await arrayBufferToString(arrayBuffer);
                const fileId = getUid(fileData);
                const fileUrl = await this.instanceRepository.uploadFile(arrayBuffer, { id: fileId });
                return [filename, fileUrl];
            })
        );

        return _(mapping)
            .map(mappingItem => {
                const fileUrl = fileUrlByFilename[mappingItem.filename];
                return fileUrl ? ([mappingItem.url, fileUrl] as [string, string]) : null;
            })
            .compact()
            .fromPairs()
            .value();
    }

    private async getFileContents(zip: JSZip) {
        const filePaths = _(zip.files)
            .toPairs()
            .filter(([path, obj]) => path.startsWith(this.exportConfig.filesFolder + "/") && !obj.dir)
            .value();

        return _.compact(
            await promiseMap(filePaths, async ([path, obj]) => {
                const arrayBuffer = await obj.async("arraybuffer");
                const filename = path.split("/")[1];
                return filename ? { filename, arrayBuffer } : undefined;
            })
        );
    }

    private async getJsonFromFile<T>(zip: JSZip, filename: string): Promise<T | undefined> {
        const obj = zip.file(filename);
        if (!obj) return;
        const blob = await obj.async("blob");
        const text = await blob.text();
        return JSON.parse(text) as T;
    }

    private async getFiles(urls: string[], baseUrlWithCredentials: string) {
        const files = await promiseMap(urls, async url => {
            // When fetching resources from our DHIS2 instance in development, we need credentials=include,
            // but other servers may fail when requested with credentials.
            const credentials = url.startsWith(baseUrlWithCredentials) ? "include" : "omit";
            const blob = await fetch(url, { credentials })
                .then(res => (res.status >= 200 && res.status < 300 && !res.redirected ? res : Promise.reject()))
                .then(res => res.blob())
                // Make sure we capture only image URLs
                .then(blob => (blob.type.startsWith("image/") ? blob : Promise.reject()))
                .catch(_err => null);

            return blob ? { url, blob } : null;
        });

        return _.compact(files);
    }

    private addJsonToZip(zip: JSZip, path: string, contents: unknown) {
        const json = JSON.stringify(contents, null, 4);
        const blob = new Blob([json], { type: "application/json" });
        zip.file(path, blob);
    }
}

function arrayBufferToString(buffer: ArrayBuffer, encoding = "UTF-8"): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const blob = new Blob([buffer], { type: "text/plain" });
        const reader = new FileReader();

        reader.onload = ev => {
            if (ev.target) {
                resolve(ev.target.result as string);
            } else {
                reject(new Error("Could not convert array to string!"));
            }
        };

        reader.readAsText(blob, encoding);
    });
}
