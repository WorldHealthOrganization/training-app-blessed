import {UseCase} from "../../webapp/CompositionRoot"
import { TrainingModuleRepository } from "../repositories/TrainingModuleRepository";

export class UploadFileUseCase implements UseCase{
    constructor(private trainingModuleRepository : TrainingModuleRepository){}

    public async execute(file: File): Promise<String>{
        return this.trainingModuleRepository.uploadFile(file);
    }
}