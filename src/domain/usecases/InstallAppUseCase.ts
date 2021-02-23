import { UseCase } from "../../webapp/CompositionRoot";
import { InstanceRepository } from "../repositories/InstanceRepository";
import { TrainingModuleRepository } from "../repositories/TrainingModuleRepository";

export class InstallAppUseCase implements UseCase {
    constructor(
        private instanceRepository: InstanceRepository,
        private trainingModuleRepository: TrainingModuleRepository
    ) {}

    public async execute(moduleId: string): Promise<boolean> {
        const module = await this.trainingModuleRepository.get(moduleId);
        if (!module?.name) return false;

        // TODO: We should store app hub id on model instead of using display name
        return this.instanceRepository.installApp(module.displayName.referenceValue);
    }
}
