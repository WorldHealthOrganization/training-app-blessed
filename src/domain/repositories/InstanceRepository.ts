import { UserSearch } from "../../data/entities/SearchUser";
import { InstalledApp } from "../entities/InstalledApp";

export interface InstanceRepository {
    baseUrl: string;
    uploadFile(file: ArrayBuffer, options?: UploadFileOptions): Promise<string>;
    installApp(appId: string): Promise<boolean>;
    isAppInstalledByUrl(launchUrl: string): Promise<boolean>;
    searchUsers(query: string): Promise<UserSearch>;
    listInstalledApps(): Promise<InstalledApp[]>;
    getVersion(): Promise<string>;
}

export interface UploadFileOptions {
    id?: string;
}
