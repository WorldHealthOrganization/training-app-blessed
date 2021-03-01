import { UseCase } from "../../webapp/CompositionRoot";
import { TrainingModuleRepository } from "../repositories/TrainingModuleRepository";

export class ImportModulesUseCase implements UseCase {
    constructor(private trainingModuleRepository: TrainingModuleRepository) {}

    public async execute(zips: unknown[]): Promise<void> {
        console.error("Not implemented yet", this.trainingModuleRepository, zips);
    }
}
