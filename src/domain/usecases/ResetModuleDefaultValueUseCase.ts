import { UseCase } from "../../webapp/CompositionRoot";
import { TrainingModuleRepository } from "../repositories/TrainingModuleRepository";

export class ResetModuleDefaultValueUseCase implements UseCase {
    constructor(private trainingModuleRepository: TrainingModuleRepository) {}

    public async execute(id: string): Promise<void> {
        return this.trainingModuleRepository.resetDefaultValue(id);
    }
}
