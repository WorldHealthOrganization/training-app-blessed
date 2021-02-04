import { Either } from "../entities/Either";
import { TrainingModule, TrainingModuleBuilder } from "../entities/TrainingModule";

export interface TrainingModuleRepository {
    list(): Promise<TrainingModule[]>;
    get(moduleKey: string): Promise<TrainingModule | undefined>;
    create(builder: TrainingModuleBuilder): Promise<Either<"CODE_EXISTS", void>>;
    edit(builder: TrainingModuleBuilder): Promise<void>;
    delete(ids: string[]): Promise<void>;
    swapOrder(id1: string, id2: string): Promise<void>;
    updateProgress(id: string, lastStep: number, completed: boolean): Promise<void>;
    updateTranslations(id: string): Promise<void>;
    initializeTranslation(id: string): Promise<void>;
    uploadFile(file: ArrayBuffer): Promise<string>;
}
