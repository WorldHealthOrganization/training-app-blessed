import { PartialBy } from "../../types/utils";
import { GetSchemaType, Schema } from "../../utils/codec";
import { DatedPropertiesModel, SharedPropertiesModel } from "./Ref";
import { TranslatableTextModel } from "./TranslatableText";
import { TranslationConnectionModel } from "./TranslationProvider";
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

const BaseModel = Schema.extend(DatedPropertiesModel, SharedPropertiesModel);

export const TrainingModuleModel = Schema.extend(
    BaseModel,
    Schema.object({
        id: Schema.string,
        name: TranslatableTextModel,
        translation: TranslationConnectionModel,
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
        dhisAuthorities: Schema.array(Schema.string),
        installed: Schema.boolean,
    })
);

export type TrainingModule = GetSchemaType<typeof TrainingModuleModel>;
export type TrainingModuleType = GetSchemaType<typeof TrainingModuleTypeModel>;
export type TrainingModuleStep = GetSchemaType<typeof TrainingModuleStepModel>;
export type TrainingModuleContents = GetSchemaType<typeof TrainingModuleContentsModel>;

export type PartialTrainingModule = PartialBy<
    TrainingModule,
    | "user"
    | "created"
    | "lastUpdated"
    | "lastUpdatedBy"
    | "publicAccess"
    | "userAccesses"
    | "userGroupAccesses"
    | "progress"
    | "installed"
>;

export const extractStepFromKey = (key: string): { step: number; content: number } | null => {
    const match = /^.*-(\d*)-(\d*)$/.exec(key);
    if (!match) return null;

    const [stepKey, step, content] = match;
    if (!stepKey || !step || !content) return null;

    return { step: parseInt(step), content: parseInt(content) };
};

export const isValidTrainingType = (type: string): type is TrainingModuleType => {
    return ["app", "core", "widget"].includes(type);
};

export const trainingModuleValidations: ModelValidation[] = [];

export const defaultTrainingModule: PartialTrainingModule = {
    id: "",
    name: { key: "module-name", referenceValue: "", translations: {} },
    type: "app",
    revision: 1,
    dhisVersionRange: "",
    dhisAppKey: "",
    dhisLaunchUrl: "",
    dhisAuthorities: [],
    disabled: false,
    translation: { provider: "NONE" },
    contents: {
        welcome: { key: "module-welcome", referenceValue: "", translations: {} },
        steps: [],
    },
};
