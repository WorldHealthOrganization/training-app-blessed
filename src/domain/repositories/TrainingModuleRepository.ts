import { TrainingModule } from "../entities/TrainingModule";

export interface TrainingModuleRepository {
    get(moduleKey: string): Promise<TrainingModule | undefined>;
}
