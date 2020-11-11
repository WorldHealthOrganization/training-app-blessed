import { SharingSetting, NamedRef } from "../../domain/entities/Ref";
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

export interface PersistentTrainingModule extends JSONTrainingModule {
    publicAccess: string;
    userAccesses: SharingSetting[];
    userGroupAccesses: SharingSetting[];
    user: NamedRef;
    created: string;
    lastUpdated: string;
    lastUpdatedBy: NamedRef;
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
