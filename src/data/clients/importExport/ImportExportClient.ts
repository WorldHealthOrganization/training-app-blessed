import FileSaver from "file-saver";
import JSZip from "jszip";
import _ from "lodash";
import moment from "moment";
import { TranslatableText } from "../../../domain/entities/TranslatableText";
import { InstanceRepository } from "../../../domain/repositories/InstanceRepository";
import { fromPairs } from "../../../types/utils";
import { promiseMap } from "../../../utils/promises";

export type Mapping = MappingItem[];

export interface MappingItem {
    url: string;
    filename: string;
    type: string;
}

export interface ExportableItem {
    id: string;
    name: TranslatableText;
}

export class ImportExportClient {
    exportConfig = {
        filesMapper: "files.json",
        filesFolder: "files",
    };

    constructor(private instanceRepository: InstanceRepository, private prefix: string) {}

    public async import<T>(files: Blob[]): Promise<T[]> {
        const modules = await promiseMap(files, async file => {
            const zip = new JSZip();
            const contents = await zip.loadAsync(file);
            const mapping = await this.getJsonFromFile<Mapping>(zip, this.exportConfig.filesMapper);
            const fileContents = await this.getFileContents(contents);
            const urlMapping = await this.getUrlMapping(fileContents, mapping);
            const modulePaths = this.getModulePaths(contents);

            return promiseMap(modulePaths, async modulePath => {
                const model = await this.getJsonFromFile<T>(zip, modulePath);
                return model ? replaceUrls(model, urlMapping) : undefined;
            });
        });

        return _.compact(_.flatten(modules));
    }

    public async export<T extends ExportableItem>(parts: Array<T | undefined>): Promise<void> {
        const zip = new JSZip();
        const mappedParts = await promiseMap(parts, async part => {
            const name = _.kebabCase(`${this.prefix}-${part?.name.referenceValue}`);
            this.addJsonToZip(zip, name + ".json", part);
            return part;
        });
        await this.addFiles(_.compact(mappedParts), zip);
        const blob = await zip.generateAsync({ type: "blob" });
        const date = moment().format("YYYYMMDDHHmm");
        FileSaver.saveAs(blob, `${this.prefix}-${date}.zip`);
    }

    private async addFiles<T extends ExportableItem>(modules: Array<T | undefined>, zip: JSZip) {
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

    private getModulePaths(contents: JSZip) {
        return _(contents.files)
            .pickBy((_zip, path) => path.startsWith(this.prefix))
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

    private async getFiles(urls: string[], baseUrlWithCredentials: string) {
        const files = await promiseMap(urls, async url => {
            // When fetching resources from our DHIS2 instance in development, we need credentials=include,
            // but other servers may fail when requested with credentials.
            const credentials = !url.startsWith("http") || url.startsWith(baseUrlWithCredentials) ? "include" : "omit";
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

// Full-fledged url regexp are extremely slow, so let's use a very simple on that covers our use-cases:
//   [Some link](http://some-link.com/path?x=1)
//   [Some link](http://some-link.com/path?x=1 "Title")
//   <img src="http://some-link.com/path?x=1">
const urlRegExp = /(https?:\/\/|\.\.\/)[^\\"\s)]+/g;

function getUrls<T>(module: T): string[] {
    // For simplicity, process directly the JSON representation of the module
    const json = JSON.stringify(module);
    const urls = Array.from(json.matchAll(urlRegExp)).map(groups => groups[0]);
    return _(urls).compact().uniq().value();
}

function replaceUrls<T>(module: T, urlMapping: Record<string, string>): T {
    const json = JSON.stringify(module);
    const json2 = json.replace(urlRegExp, url => urlMapping[url] || url);
    return JSON.parse(json2);
}
