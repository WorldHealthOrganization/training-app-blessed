import { UseCase } from "../../webapp/CompositionRoot";
import { LandingNode } from "../entities/LandingPage";
import { LandingPageRepository } from "../repositories/LandingPageRepository";

export class SwapLandingChildOrderUseCase implements UseCase {
    constructor(private landingPagesRepository: LandingPageRepository) {}

    public async execute(node1: LandingNode, node2: LandingNode): Promise<void> {
        return this.landingPagesRepository.swapOrder(node1, node2);
    }
}
