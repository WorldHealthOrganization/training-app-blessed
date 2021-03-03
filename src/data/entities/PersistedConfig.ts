import { Permission } from "../../domain/entities/Permission";

export interface PersistedConfig {
    poeditorToken?: string;
    settingsPermissions?: Permission;
    showAllModules?: boolean;
}
