import FileType from "file-type/browser";
import Resizer from "react-image-file-resizer";
import { ConfigRepository } from "../../domain/repositories/ConfigRepository";
import { InstanceRepository } from "../../domain/repositories/InstanceRepository";
import { D2Api } from "../../types/d2-api";
import { cache, clearCache } from "../../utils/cache";
import { UserSearch } from "../entities/SearchUser";
import { getD2APiFromInstance } from "../utils/d2-api";

export class InstanceDhisRepository implements InstanceRepository {
    private api: D2Api;

    constructor(config: ConfigRepository) {
        this.api = getD2APiFromInstance(config.getInstance());
    }

    public async uploadFile(data: ArrayBuffer): Promise<string> {
        const type = await FileType.fromBuffer(data);
        const { mime = "application/unknown" } = type ?? {};
        const blob = new Blob([data], { type: mime });
        const resized = mime.startsWith("image") ? await resizeFile(blob) : blob;

        const { id } = await this.api.files
            .upload({
                name: `[Training App] Uploaded file`,
                data: resized,
            })
            .getData();

        return `${this.api.apiPath}/documents/${id}/data`;
    }

    public async installApp(appName: string): Promise<boolean> {
        clearCache(this.isAppInstalledByUrl, this);

        const storeApps = await this.listStoreApps();
        const { versions = [] } = storeApps.find(({ name }) => name === appName) ?? {};
        const latestVersion = versions[0]?.id;
        if (!latestVersion) return false;

        try {
            await this.api.appHub.install(latestVersion).getData();
        } catch (error) {
            return false;
        }

        return true;
    }

    public async searchUsers(query: string): Promise<UserSearch> {
        const options = {
            fields: { id: true, displayName: true },
            filter: { displayName: { ilike: query } },
        };

        return this.api.metadata.get({ users: options, userGroups: options }).getData();
    }
    @cache()
    public async isAppInstalledByUrl(launchUrl: string): Promise<boolean> {
        try {
            await this.api.baseConnection.request({ method: "get", url: launchUrl }).getData();
        } catch (error) {
            return false;
        }

        return true;
    }

    private async listStoreApps() {
        try {
            return this.api.appHub.list().getData();
        } catch (error) {
            console.error(error);
            return [];
        }
    }
}

const resizeFile = (file: Blob): Promise<Blob> => {
    return new Promise(resolve => {
        Resizer.imageFileResizer(file, 300, 300, "JPEG", 100, 0, blob => resolve(blob as Blob), "blob");
    });
};
