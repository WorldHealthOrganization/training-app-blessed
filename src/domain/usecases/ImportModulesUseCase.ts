import { PersistedTrainingModule } from "../../data/entities/PersistedTrainingModule";
import { UseCase } from "../../webapp/CompositionRoot";
import { TrainingModuleRepository } from "../repositories/TrainingModuleRepository";

export class ImportModulesUseCase implements UseCase {
    constructor(private trainingModuleRepository: TrainingModuleRepository) {}

    public async execute(files: File[]): Promise<PersistedTrainingModule[]> {
        return this.trainingModuleRepository.import(files);
    }
}
