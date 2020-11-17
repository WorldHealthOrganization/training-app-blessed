import { UseCase } from "../../webapp/CompositionRoot";
import { ConfigRepository } from "../repositories/ConfigRepository";

export class SavePoEditorTokenUseCase implements UseCase {
    constructor(private configRepository: ConfigRepository) {}

    public async execute(token: string): Promise<void> {
        return this.configRepository.setPoEditorToken(token);
    }
}
