import { UseCase } from "../../webapp/CompositionRoot";
//import { LandingNode } from "../entities/LandingPage";
import { LandingPageRepository } from "../repositories/LandingPageRepository";

export class ExportLandingPagesUseCase implements UseCase {
    constructor(private landingPagesRepository: LandingPageRepository) {}

    public async execute(ids: string[]): Promise<void> {
        return this.landingPagesRepository.export(ids);
    }
}
