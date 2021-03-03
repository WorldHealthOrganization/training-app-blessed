import { UseCase } from "../../webapp/CompositionRoot";
import { ConfigRepository } from "../repositories/ConfigRepository";

export class SetShowAllModulesUseCase implements UseCase {
    constructor(private configRepository: ConfigRepository) {}

    public async execute(flag: boolean): Promise<void> {
        return this.configRepository.setShowAllModules(flag);
    }
}
