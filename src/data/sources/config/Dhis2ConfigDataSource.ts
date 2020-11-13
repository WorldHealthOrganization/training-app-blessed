import { D2Api } from "../../../types/d2-api";
import { cache } from "../../../utils/cache";
import { Instance } from "../../entities/Instance";
import { User } from "../../entities/User";
import { getD2APiFromInstance } from "../../utils/d2-api";
import { ConfigDataSource } from "./ConfigDataSource";

export class Dhis2ConfigDataSource implements ConfigDataSource {
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
                },
            })
            .getData();

        return {
            id: d2User.id,
            name: d2User.displayName,
            ...d2User.userCredentials,
        };
    }

    public getInstance(): Instance {
        return this.instance;
    }
}
