import { Instance } from "../../data/entities/Instance";
import { User } from "../../data/entities/User";
import { Permission } from "../entities/Permission";

export interface ConfigRepository {
    getUser(): Promise<User>;
    getInstance(): Instance;
    setPoEditorToken(token: string): Promise<void>;
    getPoEditorToken(): Promise<string | undefined>;
    getSettingsPermissions(): Promise<Permission>;
    updateSettingsPermissions(update: Partial<Permission>): Promise<void>;
}
