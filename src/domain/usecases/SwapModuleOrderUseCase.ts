import { UseCase } from "../../webapp/CompositionRoot";
import { TrainingModuleRepository } from "../repositories/TrainingModuleRepository";

export class SwapModuleOrderUseCase implements UseCase {
    constructor(private trainingModuleRepository: TrainingModuleRepository) {}

    public async execute(id1: string, id2: string): Promise<void> {
        return this.trainingModuleRepository.swapOrder(id1, id2);
    }
}
