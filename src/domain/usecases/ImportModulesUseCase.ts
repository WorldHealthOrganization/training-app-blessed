import { UseCase } from "../../webapp/CompositionRoot";
import { TrainingModuleRepository } from "../repositories/TrainingModuleRepository";

export class ImportModulesUseCase implements UseCase {
    constructor(private trainingModuleRepository: TrainingModuleRepository) {}

    public async execute(zips: unknown[]): Promise<void> {
        // TODO
        console.log(zips, this.trainingModuleRepository);
    }
}
