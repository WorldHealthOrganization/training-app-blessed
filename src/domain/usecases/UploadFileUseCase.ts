import { UseCase } from "../../webapp/CompositionRoot";
import { TrainingModuleRepository } from "../repositories/TrainingModuleRepository";

export class UploadFileUseCase implements UseCase {
    constructor(private trainingModuleRepository: TrainingModuleRepository) {}

    public async execute(data: ArrayBuffer): Promise<string> {
        return this.trainingModuleRepository.uploadFile(data);
    }
}
