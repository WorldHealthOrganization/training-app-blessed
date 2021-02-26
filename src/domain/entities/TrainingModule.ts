import { PartialBy } from "../../types/utils";
import { GetSchemaType, Schema } from "../../utils/codec";
import { BaseMetadataModel } from "./Ref";
import { TranslatableText, TranslatableTextModel } from "./TranslatableText";
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

export const TrainingModuleModel = Schema.extend(
    BaseMetadataModel,
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
        editable: Schema.boolean,
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
    | "editable"
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

export const updateTranslation = (module: PartialTrainingModule, key: string, value: string, language?: string) => {
    const translate = (text: TranslatableText): TranslatableText => {
        if (key !== text.key) return text;

        return !language
            ? { ...text, referenceValue: value }
            : { ...text, translations: { ...text.translations, [language]: value } };
    };

    return {
        ...module,
        name: translate(module.name),
        contents: {
            ...module.contents,
            welcome: translate(module.contents.welcome),
            steps: module.contents.steps.map(step => ({
                ...step,
                title: translate(step.title),
                pages: step.pages.map(page => translate(page)),
            })),
        },
    };
};
