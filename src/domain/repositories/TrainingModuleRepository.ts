import { TrainingModule } from "../entities/TrainingModule";

export interface TrainingModuleRepository {
    getModule(moduleKey: string): Promise<TrainingModule>;
}
