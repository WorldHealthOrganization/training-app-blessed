import { UseCase } from "../../webapp/CompositionRoot";
import { LandingPageRepository } from "../repositories/LandingPageRepository";

export class ExportLandingPagesTranslationsUseCase implements UseCase {
    constructor(private landingPageRepository: LandingPageRepository) {}

    public async execute(): Promise<void> {
        await this.landingPageRepository.exportTranslations();
    }
}
