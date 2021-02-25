import { UseCase } from "../../webapp/CompositionRoot";
import { TranslatableText } from "../entities/TranslatableText";
import { TrainingModuleRepository } from "../repositories/TrainingModuleRepository";

export class UpdateModuleContentsUseCase implements UseCase {
    constructor(private trainingModuleRepository: TrainingModuleRepository) {}

    public async execute(moduleId: string, key: string, value: string, language?: string): Promise<void> {
        const module = await this.trainingModuleRepository.get(moduleId);
        if (!module) return;

        const updateTranslation = (text: TranslatableText): TranslatableText => {
            if (key !== text.key) return text;

            return !language
                ? { ...text, referenceValue: value }
                : { ...text, translations: { ...text.translations, [language]: value } };
        };

        await this.trainingModuleRepository.update({
            ...module,
            name: updateTranslation(module.name),
            contents: {
                ...module.contents,
                welcome: updateTranslation(module.contents.welcome),
                steps: module.contents.steps.map(step => ({
                    ...step,
                    title: updateTranslation(step.title),
                    pages: step.pages.map(page => updateTranslation(page)),
                })),
            },
        });
    }
}
