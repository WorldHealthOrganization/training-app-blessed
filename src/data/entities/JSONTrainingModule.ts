import { TrainingModuleContents, TranslationConnection } from "../../domain/entities/TrainingModule";
import { TranslatableText } from "../../domain/entities/TranslatableText";

export interface JSONTrainingModule {
    _version: number;
    id: string;
    name: TranslatableText;
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
