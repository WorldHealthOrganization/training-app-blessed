import { UseCase } from "../../webapp/CompositionRoot";
import { TrainingModule } from "../entities/TrainingModule";
import { TrainingModuleRepository } from "../repositories/TrainingModuleRepository";

export class GetModuleUseCase implements UseCase {
    constructor(private trainingModuleRepository: TrainingModuleRepository) {}

    public async execute(moduleKey: string): Promise<TrainingModule> {
        return this.trainingModuleRepository.getModule(moduleKey);
    }
}
