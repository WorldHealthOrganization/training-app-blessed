import { TrainingModule } from "../entities/TrainingModule";
import { UseCase } from "../../webapp/CompositionRoot";
import { TrainingModuleRepository } from "../repositories/TrainingModuleRepository";

export class UpdateModuleUseCase implements UseCase {
    constructor(private trainingModuleRepository: TrainingModuleRepository) {}

    public async execute(builder: TrainingModule): Promise<void> {
        return this.trainingModuleRepository.update(builder);
    }
}
