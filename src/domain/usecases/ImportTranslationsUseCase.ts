import { UseCase } from "../../webapp/CompositionRoot";
import { TrainingModuleRepository } from "../repositories/TrainingModuleRepository";

export class ImportTranslationsUseCase implements UseCase {
    constructor(private trainingModuleRepository: TrainingModuleRepository) {}

    public async execute(key: string, lang: string, terms: Record<string, string>): Promise<void> {
        await this.trainingModuleRepository.importTranslations(key, lang, terms);
    }
}
