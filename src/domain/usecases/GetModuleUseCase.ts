import { UseCase } from "../../webapp/CompositionRoot";
import { TrainingModule } from "../entities/TrainingModule";
import { TrainingModuleRepository } from "../repositories/TrainingModuleRepository";

export class GetModuleUseCase implements UseCase {
    constructor(private trainingModuleRepository: TrainingModuleRepository) {}

    public async execute(moduleKey: string): Promise<TrainingModule> {
        const trainingModule = await this.trainingModuleRepository.get(moduleKey);
        if (!trainingModule) throw new Error("NOT FOUND");
        return trainingModule;
    }
}
