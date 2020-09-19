import { SharedRef } from "./Ref";

export type TrainingModuleType = "app" | "core" | "widget";

export interface TrainingModule extends SharedRef {
    key: string;
    type: TrainingModuleType;
    details: TrainingModuleDetails;
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
    text: string;
}

export interface TrainingModuleDetails {
    title: string;
    description: string;
    icon: string;
}
