import { UserSearch } from "../../data/entities/SearchUser";
import { InstalledApp } from "../entities/InstalledApp";
import { NamedRef } from "../entities/Ref";

export interface InstanceRepository {
    getBaseUrl(): string;
    uploadFile(file: ArrayBuffer, options?: UploadFileOptions): Promise<string>;
    installApp(appId: string): Promise<boolean>;
    isAppInstalledByUrl(launchUrl: string): Promise<boolean>;
    searchUsers(query: string): Promise<UserSearch>;
    listInstalledApps(): Promise<InstalledApp[]>;
    getVersion(): Promise<string>;
    listDanglingDocuments(): Promise<NamedRef[]>;
    deleteDocuments(ids: string[]): Promise<void>;
}

export interface UploadFileOptions {
    id?: string;
    name?: string;
}
