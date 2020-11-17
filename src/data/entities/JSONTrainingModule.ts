import { TrainingModuleContents } from "../../domain/entities/TrainingModule";

export interface JSONTrainingModule {
    _version: number;
    id: string;
    name: string;
    type: string;
    disabled: boolean;
    contents: TrainingModuleContents;
    translation?: { provider: string; project?: string };
    revision: number;
    dhisVersionRange: string;
    dhisAppKey: string;
    dhisLaunchUrl: string;
}
