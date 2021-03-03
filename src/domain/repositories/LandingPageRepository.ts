import { LandingNode } from "../entities/LandingPage";

export interface LandingPageRepository {
    list(): Promise<LandingNode[]>;
    updateChild(node: LandingNode): Promise<void>;
    removeChilds(ids: string[]): Promise<void>;
}
