import { UseCase } from "../../webapp/CompositionRoot";
import { LandingNode } from "../entities/LandingPage";
import { LandingPageRepository } from "../repositories/LandingPageRepository";

export class UpdateLandingChildUseCase implements UseCase {
    constructor(private landingPagesRepository: LandingPageRepository) {}

    public async execute(node: LandingNode): Promise<void> {
        return this.landingPagesRepository.updateChild(node);
    }
}
