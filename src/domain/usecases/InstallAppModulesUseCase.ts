import { UseCase } from "../../webapp/CompositionRoot";
import { InstanceRepository } from "../repositories/InstanceRepository";

export class InstallAppModulesUseCase implements UseCase {
    constructor(private instanceRepository: InstanceRepository) {}

    public async execute(appId: string): Promise<boolean> {
        return this.instanceRepository.installApp(appId);
    }
}
