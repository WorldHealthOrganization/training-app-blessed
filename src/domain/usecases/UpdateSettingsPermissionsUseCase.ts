import { UseCase } from "../../webapp/CompositionRoot";
import { Permission } from "../entities/Permission";
import { ConfigRepository } from "../repositories/ConfigRepository";

export class UpdateSettingsPermissionsUseCase implements UseCase {
    constructor(private configRepository: ConfigRepository) {}

    public async execute(update: Partial<Permission>): Promise<void> {
        await this.configRepository.updateSettingsPermissions(update);
    }
}
