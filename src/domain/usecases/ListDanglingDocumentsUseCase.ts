import { UseCase } from "../../webapp/CompositionRoot";
import { NamedRef } from "../entities/Ref";
import { InstanceRepository } from "../repositories/InstanceRepository";

export class ListDanglingDocumentsUseCase implements UseCase {
    constructor(private instanceRepository: InstanceRepository) {}

    public async execute(): Promise<NamedRef[]> {
        return this.instanceRepository.listDanglingDocuments();
    }
}
