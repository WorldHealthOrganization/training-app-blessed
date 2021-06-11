import { TrainingModuleContents } from "../../domain/entities/TrainingModule";
import { TranslatableText } from "../../domain/entities/TranslatableText";

export interface JSONTrainingModule {
    _version: number;
    id: string;
    name: TranslatableText;
    icon: string;
    type: string;
    disabled: boolean;
    contents: TrainingModuleContents;
    revision: number;
    dhisVersionRange: string;
    dhisAppKey: string;
    dhisLaunchUrl: string;
    dhisAuthorities: string[];
}
