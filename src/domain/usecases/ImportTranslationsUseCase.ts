import { UseCase } from "../../webapp/CompositionRoot";
import { TrainingModuleRepository } from "../repositories/TrainingModuleRepository";

export class ImportTranslationsUseCase implements UseCase {
    constructor(private trainingModuleRepository: TrainingModuleRepository) {}

    public async execute(key: string, lang: string, file: File): Promise<void> {
        const text = await file.text();
        const terms = JSON.parse(text);

        await this.trainingModuleRepository.importTranslations(key, lang, terms);
    }
}
