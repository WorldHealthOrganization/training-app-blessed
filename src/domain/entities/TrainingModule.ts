import { SharedRef } from "./Ref";
import { TranslatableText } from "./TranslatableText";
import { UserProgress } from "./UserProgress";

export type TrainingModuleType = "app" | "core" | "widget";

export interface TrainingModule extends Omit<SharedRef, "name"> {
    name: TranslatableText;
    translation: TranslationConnection;
    type: TrainingModuleType;
    disabled: boolean;
    progress: UserProgress;
    contents: TrainingModuleContents;
    revision: number;
    dhisVersionRange: string;
    dhisAppKey: string;
    dhisLaunchUrl: string;
}

export interface TrainingModuleContents {
    welcome: TranslatableText;
    steps: TrainingModuleStep[];
}

export interface TrainingModuleStep {
    title: TranslatableText;
    subtitle?: TranslatableText;
    pages: TranslatableText[];
}

export interface TrainingModuleBuilder {
    id: string;
    name: string;
    poEditorProject: string;
}

type TranslationConnection = {
    provider: string;
    project?: string;
};

export const extractStepFromKey = (key: string): { step: number; content: number } | null => {
    const match = /^.*-(\d*)-(\d*)$/.exec(key);
    if (!match) return null;

    return { step: parseInt(match[1]), content: parseInt(match[2]) };
};

export const isValidTrainingType = (type: string): type is TrainingModuleType => {
    return ["app", "core", "widget"].includes(type);
};
