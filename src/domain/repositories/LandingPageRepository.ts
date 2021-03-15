import { LandingNode } from "../entities/LandingPage";
//import { PersistedLandingPage } from "../../data/entities/PersistedLandingPage";

export interface LandingPageRepository {
    list(): Promise<LandingNode[]>;
    export(ids: string[]): Promise<void>;
    //import(files: File[]): Promise<PersistedLandingPage[]>;
    updateChild(node: LandingNode): Promise<void>;
    removeChilds(ids: string[]): Promise<void>;
}
