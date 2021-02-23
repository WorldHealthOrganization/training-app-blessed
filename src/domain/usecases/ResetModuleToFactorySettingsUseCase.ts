import { UseCase } from "../../webapp/CompositionRoot";
import { TrainingModuleRepository } from "../repositories/TrainingModuleRepository";

export class ResetModuleToFactorySettingsUseCase implements UseCase {
    constructor(private trainingModuleRepository: TrainingModuleRepository) {}

    public async execute(key: string | undefined): Promise<void> {
        return this.trainingModuleRepository.resetToFactorySettings(key);
    }
}
