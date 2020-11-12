import { D2Api } from "../../../types/d2-api";
import { generateUid } from "../../utils/uid";
import { constantPrefix } from "./Namespaces";
import { StorageClient } from "./StorageClient";

interface Constant {
    id: string;
    code: string;
    name: string;
    description: string;
}

export class ConstantStorageClient extends StorageClient {
    constructor(private api: D2Api) {
        super();
    }

    private buildDefault<T extends object>(key: string, value: T): Constant {
        return {
            id: generateUid(),
            code: key,
            name: `${constantPrefix} - ${key}`,
            description: JSON.stringify(value, null, 2),
        };
    }

    private async getConstant(key: string): Promise<Partial<Constant>> {
        const { objects: constants } = await this.api.models.constants
            .get({
                paging: false,
                fields: { id: true, code: true, name: true, description: true },
                filter: { code: { eq: key } },
            })
            .getData();

        return constants[0] ?? {};
    }

    public async getObject<T extends object>(key: string): Promise<T | undefined> {
        const { description } = await this.getConstant(key);
        return description ? JSON.parse(description) : undefined;
    }

    public async getOrCreateObject<T extends object>(key: string, defaultValue: T): Promise<T> {
        const result = await this.getObject<T>(key);
        if (!result) {
            await this.api.models.constants.post(this.buildDefault(key, defaultValue)).getData();
        }
        return result ?? defaultValue;
    }

    public async saveObject<T extends object>(key: string, value: T): Promise<void> {
        const { id = generateUid(), name = `${constantPrefix} - ${key}` } = await this.getConstant(
            key
        );

        const response = await this.api.models.constants
            .put({ id, name, code: key, description: JSON.stringify(value, null, 4) })
            .getData();

        if (response.status !== "OK") {
            throw new Error(JSON.stringify(response.message, null, 2));
        }
    }

    public async removeObject(key: string): Promise<void> {
        const { id } = await this.getConstant(key);
        if (id) await this.api.models.constants.delete({ id }).getData();
    }
}
