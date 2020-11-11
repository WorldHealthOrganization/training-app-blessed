import { TranslatableText } from "./TranslatableText";

export interface JSONTrainingModule {
    id: string;
    name: string;
    key: string;
    type: string;
    disabled: boolean;
    contents: JSONTrainingModuleContents;
    revision: number;
    dhisVersionRange: string;
    dhisAppKey: string;
    dhisLaunchUrl: string;
}

export interface JSONTrainingModuleContents {
    welcome: { title: TranslatableText; description: TranslatableText; icon: TranslatableText };
    steps: JSONTrainingModuleStep[];
}

export interface JSONTrainingModuleStep {
    title: TranslatableText;
    subtitle?: TranslatableText;
    pages: TranslatableText[];
}
