import { UseCase } from "../../webapp/CompositionRoot";
import { TrainingModuleRepository } from "../repositories/TrainingModuleRepository";

export class UpdateUserProgressUseCase implements UseCase {
    constructor(private trainingModuleRepository: TrainingModuleRepository) {}

    public async execute(moduleId: string, progress: number): Promise<void> {
        return this.trainingModuleRepository.updateProgress(moduleId, progress);
    }
}
