import { UseCase } from "../../webapp/CompositionRoot";
import { LandingPageRepository } from "../repositories/LandingPageRepository";

export class ImportLandingPagesTranslationsUseCase implements UseCase {
    constructor(private landingPageRepository: LandingPageRepository) {}

    public async execute(lang: string, terms: Record<string, string>): Promise<void> {
        await this.landingPageRepository.importTranslations(lang, terms);
    }
}
