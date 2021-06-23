import { UseCase } from "../../webapp/CompositionRoot";
import { InstanceRepository } from "../repositories/InstanceRepository";

export class DeleteDocumentsUseCase implements UseCase {
    constructor(private instanceRepository: InstanceRepository) {}

    public async execute(ids: string[]): Promise<void> {
        return this.instanceRepository.deleteDocuments(ids);
    }
}
