import { GetSchemaType, Schema } from "../../utils/codec";
import { SharedRefModel } from "./Ref";
import { TranslatableTextModel } from "./TranslatableText";
import { ModelValidation } from "./Validation";

export const TrainingModuleTypeModel = Schema.oneOf([
    Schema.exact("app"),
    Schema.exact("core"),
    Schema.exact("widget"),
]);

export const TrainingModuleStepModel = Schema.object({
    title: TranslatableTextModel,
    subtitle: Schema.optional(TranslatableTextModel),
    pages: Schema.array(TranslatableTextModel),
});

export const TrainingModuleContentsModel = Schema.object({
    welcome: TranslatableTextModel,
    steps: Schema.array(TrainingModuleStepModel),
});

export const TrainingModuleModel = Schema.extend(
    SharedRefModel,
    Schema.object({
        displayName: TranslatableTextModel,
        translation: Schema.object({
            provider: Schema.string,
            project: Schema.optional(Schema.string),
        }),
        type: TrainingModuleTypeModel,
        disabled: Schema.optionalSafe(Schema.boolean, false),
        progress: Schema.object({
            id: Schema.string,
            lastStep: Schema.number,
            completed: Schema.boolean,
        }),
        contents: TrainingModuleContentsModel,
        revision: Schema.number,
        dhisVersionRange: Schema.string,
        dhisAppKey: Schema.string,
        dhisLaunchUrl: Schema.string,
        installed: Schema.boolean,
    })
);

export type TrainingModule = GetSchemaType<typeof TrainingModuleModel>;
export type TrainingModuleType = GetSchemaType<typeof TrainingModuleTypeModel>;
export type TrainingModuleStep = GetSchemaType<typeof TrainingModuleStepModel>;
export type TrainingModuleContents = GetSchemaType<typeof TrainingModuleContentsModel>;

export interface TrainingModuleBuilder {
    id: string;
    name: string;
    poEditorProject: string;
}

export const extractStepFromKey = (key: string): { step: number; content: number } | null => {
    const match = /^.*-(\d*)-(\d*)$/.exec(key);
    if (!match) return null;

    const [step, content] = match;
    if (!step || !content) return null;

    return { step: parseInt(step), content: parseInt(content) };
};

export const isValidTrainingType = (type: string): type is TrainingModuleType => {
    return ["app", "core", "widget"].includes(type);
};

export const trainingModuleValidations: ModelValidation[] = [];
