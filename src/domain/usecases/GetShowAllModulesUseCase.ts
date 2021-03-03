import { UseCase } from "../../webapp/CompositionRoot";
import { ConfigRepository } from "../repositories/ConfigRepository";

export class GetShowAllModulesUseCase implements UseCase {
    constructor(private configRepository: ConfigRepository) {}

    public async execute(): Promise<boolean> {
        return this.configRepository.getShowAllModules();
    }
}
