import { promiseMap } from "../../utils/promises";
import { UseCase } from "../../webapp/CompositionRoot";
import { TrainingModuleRepository } from "../repositories/TrainingModuleRepository";

export class FetchTranslationsUseCase implements UseCase {
    constructor(private trainingModuleRepository: TrainingModuleRepository) {}

    public async execute(): Promise<void> {
        const modules = await this.trainingModuleRepository.list();
        const availableModules = modules.filter(({ translation }) => translation.provider !== "NONE");

        await promiseMap(availableModules, module => this.trainingModuleRepository.updateTranslations(module.id));
    }
}
