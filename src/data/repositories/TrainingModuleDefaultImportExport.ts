import JSZip from "jszip";
import _ from "lodash";
import { InstanceRepository } from "../../domain/repositories/InstanceRepository";
import { fromPairs } from "../../types/utils";
import { promiseMap } from "../../utils/promises";
import { PersistedTrainingModule, replaceUrls } from "../entities/PersistedTrainingModule";
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
                const model = await this.getJsonFromFile<PersistedTrainingModule>(zip, modulePath);
                if (!model) return;

                const moduleWithMappedUrls = replaceUrls(model, urlMapping);
                await this.trainingModuleRepository.saveDataStore(moduleWithMappedUrls, { recreate: true });
                return moduleWithMappedUrls;
            });
        });

        return _.compact(_.flatten(modules));
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
                const fileUrl = await this.instanceRepository.uploadFile(arrayBuffer);
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
}
