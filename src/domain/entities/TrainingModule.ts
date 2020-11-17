import { SharedRef } from "./Ref";

export type TrainingModuleType = "app" | "core" | "widget";

export interface TrainingModule extends SharedRef {
    type: TrainingModuleType;
    disabled: boolean;
    progress: number;
    contents: TrainingModuleContents;
    revision: number;
    dhisVersionRange: string;
    dhisAppKey: string;
    dhisLaunchUrl: string;
}

export interface TrainingModuleContents {
    welcome: string;
    steps: TrainingModuleStep[];
}

export interface TrainingModuleStep {
    title: string;
    subtitle?: string;
    pages: string[];
}

export interface TrainingModuleBuilder {
    id: string;
    name: string;
    welcome: string;
}

export const extractStepFromKey = (key: string): { step: number; content: number } | null => {
    const match = /^.*-(\d*)-(\d*)$/.exec(key);
    if (!match) return null;

    return { step: parseInt(match[1]), content: parseInt(match[2]) };
};

export const isValidTrainingType = (type: string): type is TrainingModuleType => {
    return ["app", "core", "widget"].includes(type);
};
