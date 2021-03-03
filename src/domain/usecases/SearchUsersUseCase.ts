import { UseCase } from "../../webapp/CompositionRoot";
import { InstanceRepository } from "../repositories/InstanceRepository";
import { UserSearch } from "../../data/entities/SearchUser";

export class SearchUsersUseCase implements UseCase {
    constructor(private instanceRepository: InstanceRepository) {}

    public async execute(query: string): Promise<UserSearch> {
        return this.instanceRepository.searchUsers(query);
    }
}
