import FileSaver from "file-saver";
import JSZip from "jszip";
import _ from "lodash";
import moment from "moment";
import { InstanceRepository } from "../../domain/repositories/InstanceRepository";
import { promiseMap } from "../../utils/promises";
import { PersistedLandingPage } from "../entities/PersistedLandingPage";
import { PersistedTrainingModule } from "../entities/PersistedTrainingModule";

export type Mapping = MappingItem[];

export interface MappingItem {
    url: string;
    filename: string;
    type: string;
}

// Full-fledged url regexp are extremely slow, so let's use a very simple on that covers our use-cases:
//   [Some link](http://some-link.com/path?x=1)
//   [Some link](http://some-link.com/path?x=1 "Title")
//   <img src="http://some-link.com/path?x=1">
const urlRegExp = /https?:\/\/[^\\"\s)]+/g;

export class DefaultImportExport {
    exportConfig = {
        modulePrefix: "module-",
        landingPagePrefix: "landing-page-",
        filesMapper: "files.json",
        filesFolder: "files",
    };

    constructor(
        private instanceRepository: InstanceRepository,
    ) {}    
    public async export(parts: (PersistedTrainingModule | PersistedLandingPage | undefined)[], prefix: string): Promise<void> {
        const zip = new JSZip();
        const mappedParts = await promiseMap(parts, async part => {
            const name = _.kebabCase(prefix + part?.name.referenceValue);
            this.addJsonToZip(zip, name + ".json", part);
            return part;
        });
        await this.addFiles(_.compact(mappedParts), zip);
        const blob = await zip.generateAsync({ type: "blob" });
        const date = moment().format("YYYYMMDDHHmm");
        FileSaver.saveAs(blob, `${prefix}-${date}.zip`);
    }

    private async addFiles(modules: (PersistedTrainingModule | PersistedLandingPage | undefined)[], zip: JSZip) {
        const urls = _(modules).flatMap(this.getUrls).uniq().value();
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

    private getUrls(module: PersistedTrainingModule | PersistedLandingPage | undefined): string[] {
        // For simplicity, process directly the JSON representation of the module
        const json = JSON.stringify(module);
        const urls = Array.from(json.matchAll(urlRegExp)).map(groups => groups[0]);
        return _(urls).compact().uniq().value();
    }

}
