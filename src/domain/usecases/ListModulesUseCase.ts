import { UseCase } from "../../webapp/CompositionRoot";
import { TrainingModule } from "../entities/TrainingModule";
import { TrainingModuleRepository } from "../repositories/TrainingModuleRepository";

export class ListModulesUseCase implements UseCase {
    constructor(private trainingModuleRepository: TrainingModuleRepository) {}

    public async execute(): Promise<TrainingModule[]> {
        return this.trainingModuleRepository.list();
    }
}
