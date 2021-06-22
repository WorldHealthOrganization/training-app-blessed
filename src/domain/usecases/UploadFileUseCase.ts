import { UseCase } from "../../webapp/CompositionRoot";
import { InstanceRepository } from "../repositories/InstanceRepository";

export class UploadFileUseCase implements UseCase {
    constructor(private instanceRepository: InstanceRepository) {}

    public async execute(data: ArrayBuffer, name: string): Promise<string> {
        return this.instanceRepository.uploadFile(data, { name });
    }
}
