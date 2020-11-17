import { UseCase } from "../../webapp/CompositionRoot";
import { TrainingModuleBuilder } from "../../domain/entities/TrainingModule";
import { Either } from "../entities/Either";
import { TrainingModuleRepository } from "../repositories/TrainingModuleRepository";

export class CreateModuleUseCase implements UseCase {
    constructor(private trainingModuleRepository: TrainingModuleRepository) {}

    public async execute(builder: TrainingModuleBuilder): Promise<Either<"CODE_EXISTS", void>> {
        return this.trainingModuleRepository.create(builder);
    }
}
