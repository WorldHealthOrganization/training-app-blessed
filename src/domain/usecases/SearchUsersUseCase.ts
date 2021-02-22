import { UseCase } from "../../webapp/CompositionRoot";
import { InstanceRepository } from "../repositories/InstanceRepository";
import { SearchResult } from "../../data/entities/SearchUser";

export class SearchUsersUseCase implements UseCase {
    constructor(private instanceRepository: InstanceRepository) {}

    public async execute(query: string): Promise<SearchResult> {
        return this.instanceRepository.searchUsers(query);
    }
}
