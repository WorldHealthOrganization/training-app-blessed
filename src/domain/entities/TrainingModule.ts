import { SharedRef } from "./Ref";

export type TrainingModuleType = "app" | "core" | "widget";

export interface TrainingModule extends SharedRef {
    type: TrainingModuleType;
    steps: TrainingModuleStep[];
    versionRange: string;
    dhisVersionRange: string;
    dhisAppKey: string;
    dhisLaunchUrl: string;
}

export interface TrainingModuleStep {
    path: string;
    title: string;
    description?: string;
    contents: TrainingModuleContent[];
}

export interface TrainingModuleContent {
    type: "markdown";
    headerImageUrl?: string;
    text: string;
}
