import { TranslatableText } from "./TranslatableText";

export interface JSONTrainingModule {
    _version: number;
    id: string;
    name: string;
    type: string;
    disabled: boolean;
    contents: JSONTrainingModuleContents;
    revision: number;
    dhisVersionRange: string;
    dhisAppKey: string;
    dhisLaunchUrl: string;
}

export interface JSONTrainingModuleContents {
    welcome: TranslatableText;
    steps: JSONTrainingModuleStep[];
}

export interface JSONTrainingModuleStep {
    title: TranslatableText;
    subtitle?: TranslatableText;
    pages: TranslatableText[];
}
