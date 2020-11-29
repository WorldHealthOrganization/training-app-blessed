import { UseCase } from "../../webapp/CompositionRoot";
import { TrainingModuleRepository } from "../repositories/TrainingModuleRepository";

export class CompleteUserProgressUseCase implements UseCase {
    constructor(private trainingModuleRepository: TrainingModuleRepository) {}

    public async execute(moduleId: string): Promise<void> {
        return this.trainingModuleRepository.updateProgress(moduleId, 0, true);
    }
}
