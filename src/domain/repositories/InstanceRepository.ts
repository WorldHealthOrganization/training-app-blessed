import { UserSearch } from "../../data/entities/SearchUser";

export interface InstanceRepository {
    baseUrl: string;
    uploadFile(file: ArrayBuffer, options?: UploadFileOptions): Promise<string>;
    installApp(appId: string): Promise<boolean>;
    isAppInstalledByUrl(launchUrl: string): Promise<boolean>;
    searchUsers(query: string): Promise<UserSearch>;
}

export interface UploadFileOptions {
    id?: string;
}

