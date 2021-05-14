import { PersistedLandingPage } from "../../data/entities/PersistedLandingPage";
import { UseCase } from "../../webapp/CompositionRoot";
import { LandingPageRepository } from "../repositories/LandingPageRepository";

export class ImportLandingPagesUseCase implements UseCase {
    constructor(private landingPageRepository: LandingPageRepository) {}

    public async execute(files: File[]): Promise<PersistedLandingPage[]> {
        return this.landingPageRepository.import(files);
    }
}
