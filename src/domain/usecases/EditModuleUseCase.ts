import { UseCase } from "../../webapp/CompositionRoot";
import { TrainingModuleBuilder } from "../entities/TrainingModule";
import { TrainingModuleRepository } from "../repositories/TrainingModuleRepository";

export class EditModuleUseCase implements UseCase {
    constructor(private trainingModuleRepository: TrainingModuleRepository) {}

    public async execute(builder: TrainingModuleBuilder): Promise<void> {
        return this.trainingModuleRepository.edit(builder);
    }
}
