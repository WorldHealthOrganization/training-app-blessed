import { UseCase } from "../../webapp/CompositionRoot";
import { ConfigRepository } from "../repositories/ConfigRepository";

export class CheckSuperUserUseCase implements UseCase {
    constructor(private configRepository: ConfigRepository) {}

    public async execute(): Promise<boolean> {
        const user = await this.configRepository.getUser();

        return !!user.userRoles.find(role =>
            role.authorities.find(authority => authority === "ALL")
        );
    }
}
