import { TrainingModuleContents } from "../../domain/entities/TrainingModule";
import { TranslatableText } from "../../domain/entities/TranslatableText";

export interface JSONTrainingModule {
    _version: number;
    id: string;
    name: TranslatableText;
    type: string;
    disabled: boolean;
    contents: TrainingModuleContents;
    translation: { provider: string; project: string | undefined } | undefined;
    revision: number;
    dhisVersionRange: string;
    dhisAppKey: string;
    dhisLaunchUrl: string;
    dhisAuthorities: string[];
}
