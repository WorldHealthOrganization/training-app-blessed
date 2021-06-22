import { UseCase } from "../../webapp/CompositionRoot";
import { TrainingModuleRepository } from "../repositories/TrainingModuleRepository";

export class ImportModuleTranslationsUseCase implements UseCase {
    constructor(private trainingModuleRepository: TrainingModuleRepository) {}

    public async execute(key: string, lang: string, terms: Record<string, string>): Promise<number> {
        return this.trainingModuleRepository.importTranslations(key, lang, terms);
    }
}
