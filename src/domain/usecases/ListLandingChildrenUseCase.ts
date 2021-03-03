import { UseCase } from "../../webapp/CompositionRoot";
import { LandingNode } from "../entities/LandingPage";
import { LandingPageRepository } from "../repositories/LandingPageRepository";

export class ListLandingChildrenUseCase implements UseCase {
    constructor(private landingPagesRepository: LandingPageRepository) {}

    public async execute(): Promise<LandingNode[]> {
        return this.landingPagesRepository.list();
    }
}
