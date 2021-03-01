import { Codec, GetSchemaType, Schema } from "../../utils/codec";
import { TranslatableText, TranslatableTextModel } from "./TranslatableText";

export const LandingPageNodeTypeModel = Schema.oneOf([
    Schema.exact("page-group"),
    Schema.exact("page"),
    Schema.exact("module-group"),
    Schema.exact("module"),
]);

export const BaseNodeModel = Schema.object({
    id: Schema.string,
    type: LandingPageNodeTypeModel,
    level: Schema.integer,
});

export interface PageNode {
    id: string;
    type: "page";
    name: TranslatableText;
    icon: string;
    title: TranslatableText | undefined;
    description: TranslatableText | undefined;
    level: number;
    children: LandingGroupNode[];
}

export const PageNodeModel: Codec<PageNode> = Schema.extend(
    BaseNodeModel,
    Schema.object({
        type: Schema.exact("page"),
        name: TranslatableTextModel,
        icon: Schema.string,
        title: Schema.optional(TranslatableTextModel),
        description: Schema.optional(TranslatableTextModel),
        children: Schema.lazy(() => Schema.array(Schema.oneOf([PageGroupNodeModel, ModuleGroupNodeModel]))),
    })
);

export const ModuleNodeModel = Schema.extend(
    BaseNodeModel,
    Schema.object({
        type: Schema.exact("module"),
        name: TranslatableTextModel,
        icon: Schema.undefined,
        title: Schema.undefined,
        description: Schema.undefined,
        moduleId: Schema.string,
        children: Schema.undefined,
    })
);

export const PageGroupNodeModel = Schema.extend(
    BaseNodeModel,
    Schema.object({
        type: Schema.exact("page-group"),
        icon: Schema.undefined,
        title: Schema.optional(TranslatableTextModel),
        description: Schema.optional(TranslatableTextModel),
        children: Schema.array(PageNodeModel),
    })
);

export const ModuleGroupNodeModel = Schema.extend(
    BaseNodeModel,
    Schema.object({
        type: Schema.exact("module-group"),
        icon: Schema.undefined,
        title: Schema.optional(TranslatableTextModel),
        description: Schema.optional(TranslatableTextModel),
        children: Schema.array(ModuleNodeModel),
    })
);

export type LandingNode = LandingGroupNode | LandingPageNode | LandingModuleNode;
export type LandingNodeType = GetSchemaType<typeof LandingPageNodeTypeModel>;
export type LandingGroupNode = GetSchemaType<typeof PageGroupNodeModel> | GetSchemaType<typeof ModuleGroupNodeModel>;
export type LandingPageNode = GetSchemaType<typeof PageNodeModel>;
export type LandingModuleNode = GetSchemaType<typeof ModuleNodeModel>;

// Add validation, all items in a group must be of the same type
export const TempLandingPage: LandingPageNode = {
    id: "root",
    type: "page",
    level: 1,
    name: { key: "data-entry-landing-page-name", referenceValue: "Root page", translations: {} },
    title: undefined,
    description: undefined,
    icon: "",
    children: [
        {
            id: "root-group",
            type: "page-group",
            level: 1,
            icon: undefined,
            title: undefined,
            description: {
                key: "data-entry-description",
                referenceValue: "What do you want to learn in DHIS2?",
                translations: {},
            },
            children: [
                {
                    id: "data-entry-landing-page",
                    type: "page",
                    level: 1,
                    name: { key: "data-entry-landing-page-name", referenceValue: "Entering data", translations: {} },
                    title: {
                        key: "data-entry-landing-page-title",
                        referenceValue: "Learn to enter data on DHIS2",
                        translations: {},
                    },
                    description: undefined,
                    icon:
                        "https://user-images.githubusercontent.com/2181866/109486411-1fef1a00-7a83-11eb-8703-a246b38e627c.png",
                    children: [
                        {
                            id: "data-entry-activities",
                            type: "page-group",
                            level: 1,
                            icon: undefined,
                            title: {
                                key: "data-entry-activities-title",
                                referenceValue: "Training for activity-related data entry",
                                translations: {},
                            },
                            description: {
                                key: "data-entry-activities-description",
                                referenceValue:
                                    "Select a theme below to learn how to enter data for specific activities:",
                                translations: {},
                            },
                            children: [
                                {
                                    id: "insecticide-resistance-page",
                                    type: "page",
                                    level: 1,
                                    icon:
                                        "https://user-images.githubusercontent.com/2181866/109492811-cfc88580-7a8b-11eb-8e03-b88b64b38a81.png",
                                    name: {
                                        key: "insecticide-resistance-page-name",
                                        referenceValue: "Insecticide resistance",
                                        translations: {},
                                    },
                                    title: {
                                        key: "insecticide-resistance-page-title",
                                        referenceValue: "Learn to enter insecticide resistance data",
                                        translations: {},
                                    },
                                    description: undefined,
                                    children: [
                                        {
                                            id: "insecticide-resistance-page",
                                            type: "page-group",
                                            icon: undefined,
                                            level: 1,
                                            title: {
                                                key: "insecticide-resistance-page-title",
                                                referenceValue: "Learn to enter insecticide resistance data",
                                                translations: {},
                                            },
                                            description: undefined,
                                            children: [
                                                {
                                                    id: "insecticide-resistance-group",
                                                    type: "page",
                                                    level: 1,
                                                    icon: "",
                                                    name: {
                                                        key: "insecticide-resistance-group-name",
                                                        referenceValue: "Insecticide resistance",
                                                        translations: {},
                                                    },
                                                    title: {
                                                        key: "insecticide-resistance-group-title",
                                                        referenceValue: "Enter data from individual events",
                                                        translations: {},
                                                    },
                                                    description: {
                                                        key: "insecticide-resistance-group-title",
                                                        referenceValue:
                                                            "Select a tutorial below to learn how to enter insecticide resistance data into specific forms:",
                                                        translations: {},
                                                    },
                                                    children: [
                                                        {
                                                            id: "discriminating-concentration-bioassay-module",
                                                            type: "module-group",
                                                            level: 1,
                                                            title: {
                                                                key: "insecticide-resistance-group-name",
                                                                referenceValue: "Discriminating Concentration Bioassay",
                                                                translations: {},
                                                            },
                                                            description: undefined,
                                                            children: [],
                                                            icon: undefined,
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: "data-entry-generic",
                            type: "module-group",
                            level: 1,
                            icon: undefined,
                            title: {
                                key: "data-entry-generic-title",
                                referenceValue: "Generic training for data entry",
                                translations: {},
                            },
                            description: {
                                key: "data-entry-generic-description",
                                referenceValue:
                                    "Select a tutorial below to learn how to use data entry applications in DHIS2:",
                                translations: {},
                            },
                            children: [
                                {
                                    id: "data-entry-module",
                                    type: "module",
                                    level: 1,
                                    moduleId: "data-entry",
                                    name: {
                                        key: "data-entry-module-name",
                                        referenceValue: "Data entry",
                                        translations: {},
                                    },
                                    title: undefined,
                                    description: undefined,
                                    children: undefined,
                                    icon: undefined,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};
