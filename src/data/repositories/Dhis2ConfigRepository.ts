import { Permission } from "../../domain/entities/Permission";
import { ConfigRepository } from "../../domain/repositories/ConfigRepository";
import { D2Api } from "../../types/d2-api";
import { cache } from "../../utils/cache";
import { DataStoreStorageClient } from "../clients/storage/DataStoreStorageClient";
import { Namespaces } from "../clients/storage/Namespaces";
import { StorageClient } from "../clients/storage/StorageClient";
import { Instance } from "../entities/Instance";
import { PersistedConfig } from "../entities/PersistedConfig";
import { User } from "../entities/User";
import { getD2APiFromInstance, getMajorVersion } from "../utils/d2-api";

export class Dhis2ConfigRepository implements ConfigRepository {
    private instance: Instance;
    private api: D2Api;
    private storageClient: StorageClient;

    constructor(baseUrl: string) {
        this.instance = new Instance({ url: baseUrl });
        this.api = getD2APiFromInstance(this.instance);
        this.storageClient = new DataStoreStorageClient("global", this.instance);
    }

    @cache()
    public async getUser(): Promise<User> {
        const d2User = await this.api.currentUser
            .get({
                fields: {
                    id: true,
                    displayName: true,
                    userGroups: { id: true, name: true },
                    userCredentials: {
                        username: true,
                        userRoles: { id: true, name: true, authorities: true },
                    },
                    settings: { keyUiLocale: true },
                },
            })
            .getData();

        return {
            id: d2User.id,
            name: d2User.displayName,
            userGroups: d2User.userGroups,
            ...d2User.userCredentials,
        };
    }

    public async getUiLocale(d2User: { settings: { keyUiLocale: string; keyDbLocale: string } }): Promise<string> {
        const version = getMajorVersion(await this.api.getVersion());
        if (version > 30 && d2User.settings.keyUiLocale) {
            return d2User.settings.keyUiLocale;
        }

        const settings = await this.api.get<{ keyUiLocale: string }>("/userSettings").getData();
        return settings.keyUiLocale ?? "en";
    }

    public getInstance(): Instance {
        return this.instance;
    }

    public async setPoEditorToken(token: string): Promise<void> {
        const config = await this.getConfig();

        await this.storageClient.saveObject<PersistedConfig>(Namespaces.CONFIG, {
            ...config,
            poeditorToken: token,
        });
    }

    public async getPoEditorToken(): Promise<string | undefined> {
        const { poeditorToken } = await this.getConfig();
        return poeditorToken;
    }

    public async getSettingsPermissions(): Promise<Permission> {
        const config = await this.getConfig();
        const { users = [], userGroups = [] } = config.settingsPermissions ?? {};
        return { users, userGroups };
    }

    public async updateSettingsPermissions(update: Partial<Permission>): Promise<void> {
        const config = await this.getConfig();
        const { users = [], userGroups = [] } = config.settingsPermissions ?? {};

        await this.storageClient.saveObject<PersistedConfig>(Namespaces.CONFIG, {
            ...config,
            settingsPermissions: {
                users: update.users ?? users,
                userGroups: update.userGroups ?? userGroups,
            },
        });
    }

    public async getShowAllModules(): Promise<boolean> {
        const { showAllModules = true } = await this.getConfig();
        return showAllModules;
    }

    public async setShowAllModules(showAllModules: boolean): Promise<void> {
        const config = await this.getConfig();

        await this.storageClient.saveObject<PersistedConfig>(Namespaces.CONFIG, {
            ...config,
            showAllModules,
        });
    }

    private async getConfig(): Promise<PersistedConfig> {
        const config = await this.storageClient.getObject<PersistedConfig>(Namespaces.CONFIG);

        return config ?? {};
    }
}
