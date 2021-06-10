import { UseCase } from "../../webapp/CompositionRoot";
import { TrainingModuleRepository } from "../repositories/TrainingModuleRepository";

export class ExportTranslationsUseCase implements UseCase {
    constructor(private trainingModuleRepository: TrainingModuleRepository) {}

    public async execute(moduleKey: string): Promise<void> {
        await this.trainingModuleRepository.exportTranslations(moduleKey);
    }
}
