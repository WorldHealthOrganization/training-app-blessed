import { UserSearch } from "../../data/entities/SearchUser";

export interface InstanceRepository {
    uploadFile(file: ArrayBuffer): Promise<string>;
    installApp(appId: string): Promise<boolean>;
    isAppInstalledByUrl(launchUrl: string): Promise<boolean>;
    searchUsers(query: string): Promise<UserSearch>;
}
