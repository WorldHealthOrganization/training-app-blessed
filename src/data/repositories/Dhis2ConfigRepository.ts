import { D2Api } from "../../types/d2-api";
import { cache } from "../../utils/cache";
import { Instance } from "../entities/Instance";
import { User } from "../entities/User";
import { getD2APiFromInstance, getMajorVersion } from "../utils/d2-api";
import { ConfigRepository } from "../../domain/repositories/ConfigRepository";

export class Dhis2ConfigRepository implements ConfigRepository {
    private instance: Instance;
    private api: D2Api;

    constructor(baseUrl: string) {
        this.instance = new Instance({ url: baseUrl });
        this.api = getD2APiFromInstance(this.instance);
    }

    @cache()
    public async getUser(): Promise<User> {
        const d2User = await this.api.currentUser
            .get({
                fields: {
                    id: true,
                    displayName: true,
                    userCredentials: {
                        username: true,
                        userRoles: { id: true, name: true },
                    },
                    settings: { keyUiLocale: true },
                },
            })
            .getData();

        const uiLocale = await this.getUiLocale(d2User);

        return {
            id: d2User.id,
            name: d2User.displayName,
            uiLocale,
            ...d2User.userCredentials,
        };
    }

    public async getUiLocale(d2User: {
        settings: { keyUiLocale: string; keyDbLocale: string };
    }): Promise<string> {
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
}
