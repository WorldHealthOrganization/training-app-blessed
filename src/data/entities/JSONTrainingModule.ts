import { TrainingModuleContents } from "../../domain/entities/TrainingModule";
import { TranslatableText } from "../../domain/entities/TranslatableText";
import { TranslationConnection } from "../../domain/entities/TranslationProvider";

export interface JSONTrainingModule {
    _version: number;
    id: string;
    name: TranslatableText;
    icon: string;
    type: string;
    disabled: boolean;
    contents: TrainingModuleContents;
    translation: TranslationConnection;
    revision: number;
    dhisVersionRange: string;
    dhisAppKey: string;
    dhisLaunchUrl: string;
    dhisAuthorities: string[];
}
