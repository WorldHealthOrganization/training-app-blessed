import { UseCase } from "../../webapp/CompositionRoot";
import { TrainingModuleRepository } from "../repositories/TrainingModuleRepository";

export class InitializeTranslationsUseCase implements UseCase {
    constructor(private trainingModuleRepository: TrainingModuleRepository) {}

    public async execute(id: string): Promise<void> {
        return this.trainingModuleRepository.initializeTranslation(id);
    }
}
