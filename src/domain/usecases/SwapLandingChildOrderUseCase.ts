import { UseCase } from "../../webapp/CompositionRoot";
//import { LandingNode } from "../entities/LandingPage";
import { LandingPageRepository } from "../repositories/LandingPageRepository";

export class SwapLandingChildOrderUseCase implements UseCase {
    constructor(private landingPagesRepository: LandingPageRepository) {}

    public async execute(id1: string, id2: string): Promise<void> {
        return this.landingPagesRepository.swapOrder(id1, id2);
    }
}
