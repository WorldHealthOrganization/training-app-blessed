import { PersistedLandingPage } from "../../data/entities/PersistedLandingPage";
import { LandingNode } from "../entities/LandingPage";

export interface LandingPageRepository {
    list(): Promise<LandingNode[]>;
    export(ids: string[]): Promise<void>;
    import(files: File[]): Promise<PersistedLandingPage[]>;
    updateChild(node: LandingNode): Promise<void>;
    removeChilds(ids: string[]): Promise<void>;
    exportTranslations(): Promise<void>;
    importTranslations(language: string, terms: Record<string, string>): Promise<void>;
}
