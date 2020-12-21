import { UseCase } from "../../webapp/CompositionRoot";
import { Permission } from "../entities/Permission";
import { ConfigRepository } from "../repositories/ConfigRepository";

export class GetSettingsPermissionsUseCase implements UseCase {
    constructor(private configRepository: ConfigRepository) {}

    public async execute(): Promise<Permission> {
        return this.configRepository.getSettingsPermissions();
    }
}
