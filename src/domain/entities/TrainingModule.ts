import { SharedRef } from "./Ref";
import { TranslatableText } from "./TranslableText";

export type TrainingModuleType = "app" | "core" | "widget";

export interface TrainingModule extends SharedRef {
    key: string;
    type: TrainingModuleType;
    disabled: boolean;
    contents: TrainingModuleContents;
    revision: number;
    dhisVersionRange: string;
    dhisAppKey: string;
    dhisLaunchUrl: string;
}

export interface TrainingModuleStep {
    title: TranslatableText;
    subtitle?: TranslatableText;
    pages: TrainingModulePage[];
}

export interface TrainingModulePage extends TranslatableText {
    path?: string;
}

export interface TrainingModuleContents {
    welcome: { title: TranslatableText; description: TranslatableText; icon: TranslatableText };
    steps: TrainingModuleStep[];
}

export const extractStepFromKey = (key: string): { step: number; content: number } | null => {
    const match = /^.*-(\d)-(\d)$/.exec(key);
    if (!match) return null;

    return { step: parseInt(match[1]), content: parseInt(match[2]) };
};
