import { ConfigRepository } from "../../domain/repositories/ConfigRepository";
import { InstanceRepository } from "../../domain/repositories/InstanceRepository";
import { D2Api } from "../../types/d2-api";
import { FetchHttpClient } from "../clients/http/FetchHttpClient";
import { HttpClient } from "../clients/http/HttpClient";
import { Instance } from "../entities/Instance";
import { StoreApp } from "../entities/StoreApp";
import { getD2APiFromInstance } from "../utils/d2-api";
import { generateUid } from "../utils/uid";

export class InstanceDhisRepository implements InstanceRepository {
    private instance: Instance;
    private api: D2Api;
    private appStore: HttpClient;

    constructor(config: ConfigRepository) {
        this.instance = config.getInstance();
        this.api = getD2APiFromInstance(config.getInstance());
        this.appStore = new FetchHttpClient({ baseUrl: "https://apps.dhis2.org" });
    }

    public async uploadFile(data: ArrayBuffer): Promise<string> {
        const documentId = generateUid();

        const auth = this.instance.auth;
        const authHeaders: Record<string, string> = this.getAuthHeaders(auth);

        const formdata = new FormData();
        const blob = new Blob([data], { type: "image/jpeg" });
        formdata.append("file", blob, "file.jpg");
        formdata.append("domain", "DOCUMENT");

        const fetchOptions: RequestInit = {
            method: "POST",
            headers: { ...authHeaders },
            body: formdata,
            credentials: auth ? "omit" : ("include" as const),
        };

        const response = await fetch(`${this.api.apiPath}/fileResources`, fetchOptions);
        if (!response.ok) {
            throw Error(`An error ocurred uploading the image`);
        }

        const apiResponse: SaveApiResponse = JSON.parse(await response.text());
        const { id: fileResourceId } = apiResponse.response.fileResource;

        await this.api.models.documents
            .post({
                id: documentId,
                name: `[Training App] Uploaded file ${fileResourceId}`,
                url: fileResourceId,
            })
            .getData();

        return `${this.api.apiPath}/documents/${documentId}/data`;
    }

    public async installApp(appName: string): Promise<boolean> {
        const storeApps = await this.listStoreApps();
        const { versions = [] } = storeApps.find(({ name }) => name === appName) ?? {};
        const latestVersion = versions[0]?.id;
        if (!latestVersion) return false;

        try {
            await this.api.baseConnection
                .request({
                    method: "post",
                    url: `api/appHub/${latestVersion}`,
                })
                .getData();
        } catch (error) {
            return false;
        }

        return true;
    }

    public async isAppInstalledByUrl(launchUrl: string): Promise<boolean> {
        try {
            await this.api.baseConnection
                .request<ModuleResponse>({ method: "get", url: launchUrl })
                .getData();
        } catch (error) {
            return false;
        }

        return true;
    }

    private async listStoreApps(): Promise<StoreApp[]> {
        try {
            const apps = await this.appStore
                .request<StoreApp[]>({ method: "get", url: "/api/apps" })
                .getData();

            return apps;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    private getAuthHeaders(auth: { username: string; password: string } | undefined): Record<string, string> {
        return auth ? { Authorization: "Basic " + btoa(auth.username + ":" + auth.password) } : {};
    }
}

interface SaveApiResponse {
    response: {
        fileResource: {
            id: string;
        };
    };
}

interface ModuleResponse {
    data: string;
    headers: Headers;
    status: number;
}

interface Headers {
    cacheControl: string;
    contentType: string;
    etag: string;
    lastModified: Date;
}
