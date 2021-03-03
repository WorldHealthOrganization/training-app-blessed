import { UseCase } from "../../webapp/CompositionRoot";
import { LandingPageRepository } from "../repositories/LandingPageRepository";

export class DeleteLandingChildUseCase implements UseCase {
    constructor(private landingPagesRepository: LandingPageRepository) {}

    public async execute(ids: string[]): Promise<void> {
        return this.landingPagesRepository.removeChilds(ids);
    }
}
