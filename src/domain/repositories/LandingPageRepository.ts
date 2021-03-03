import { LandingNode } from "../entities/LandingPage";

export interface LandingPageRepository {
    list(): Promise<LandingNode[]>;
    get(key: string): Promise<LandingNode | undefined>;
    updateChild(node: LandingNode): Promise<void>;
    removeChilds(ids: string[]): Promise<void>;
}
