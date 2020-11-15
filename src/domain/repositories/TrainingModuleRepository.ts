import { TrainingModule } from "../entities/TrainingModule";

export interface TrainingModuleRepository {
    list(): Promise<TrainingModule[]>;
    get(moduleKey: string): Promise<TrainingModule | undefined>;
}
