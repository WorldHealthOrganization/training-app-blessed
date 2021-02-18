import { ConfigRepository } from "../../domain/repositories/ConfigRepository";
import { InstanceRepository } from "../../domain/repositories/InstanceRepository";
import { D2Api } from "../../types/d2-api";
import { cache, clearCache } from "../../utils/cache";
import { getD2APiFromInstance } from "../utils/d2-api";

export class InstanceDhisRepository implements InstanceRepository {
    private api: D2Api;

    constructor(config: ConfigRepository) {
        this.api = getD2APiFromInstance(config.getInstance());
    }

    public async uploadFile(data: ArrayBuffer): Promise<string> {
        const blob = new Blob([data], { type: "image/jpeg" });

        const { id } = await this.api.files
            .upload({
                name: `[Training App] Uploaded file`,
                data: blob,
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
