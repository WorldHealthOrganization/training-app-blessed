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

export const extractStepFromKey = (key: string): { step: number; content: number } | null => {
    const match = /^.*-(\d)-(\d)$/.exec(key);
    if (!match) return null;

    return { step: parseInt(match[1]), content: parseInt(match[2]) };
};
