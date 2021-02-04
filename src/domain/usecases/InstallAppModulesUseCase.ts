import { UseCase } from "../../webapp/CompositionRoot";
import { TrainingModuleRepository } from "../repositories/TrainingModuleRepository";

export class InstallAppModulesUseCase implements UseCase {
    constructor(private trainingModuleRepository: TrainingModuleRepository) {}

    public async execute(appId: string): Promise<boolean> {
        return this.trainingModuleRepository.installApp(appId);
    }
}
