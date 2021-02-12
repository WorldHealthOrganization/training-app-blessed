import { ConfigRepository } from "../../domain/repositories/ConfigRepository";
import { InstanceRepository } from "../../domain/repositories/InstanceRepository";
import { D2Api } from "../../types/d2-api";
import { Instance } from "../entities/Instance";
import { getD2APiFromInstance } from "../utils/d2-api";
import { generateUid } from "../utils/uid";

export class InstanceDhisRepository implements InstanceRepository {
    private instance: Instance;
    private api: D2Api;

    constructor(config: ConfigRepository) {
        this.instance = config.getInstance();
        this.api = getD2APiFromInstance(config.getInstance());
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

    public async installApp(appId: string): Promise<boolean> {
        try {
            await (
                await this.api.baseConnection.request({
                    method: "post",
                    url: `api/appHub/${appId}`,
                }).response
            ).status;
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

    private getAuthHeaders(
        auth: { username: string; password: string } | undefined
    ): Record<string, string> {
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
