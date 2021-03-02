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
    })
);

export const PageGroupNodeModel = Schema.extend(
    BaseNodeModel,
    Schema.object({
        type: Schema.exact("page-group"),
        name: TranslatableTextModel,
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
        name: TranslatableTextModel,
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
    name: { key: "root-name", referenceValue: "Root landing page", translations: {} },
    title: undefined,
    description: undefined,
    icon: "",
    children: [
        {
            id: "root-group",
            type: "page-group",
            level: 1,
            icon: undefined,
            name: {
                key: "root-group-name",
                referenceValue: "What do you want to learn in DHIS2?",
                translations: {},
            },
            title: undefined,
            description: {
                key: "root-group-description",
                referenceValue: "What do you want to learn in DHIS2?",
                translations: {},
            },
            children: [
                {
                    id: "data-entry-page",
                    type: "page",
                    level: 1,
                    name: { key: "data-entry-page-name", referenceValue: "Entering data", translations: {} },
                    title: {
                        key: "data-entry-page-title",
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
                            name: {
                                key: "data-entry-activities-name",
                                referenceValue: "Training for activity-related data entry",
                                translations: {},
                            },
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
                                            id: "insecticide-resistance-page-group",
                                            type: "page-group",
                                            icon: undefined,
                                            level: 1,
                                            title: {
                                                key: "insecticide-resistance-page-group-title",
                                                referenceValue: "Learn to enter insecticide resistance data",
                                                translations: {},
                                            },
                                            name: {
                                                key: "insecticide-resistance-page-group-name",
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
                                                            name: {
                                                                key: "insecticide-resistance-group-name",
                                                                referenceValue: "Discriminating Concentration Bioassay",
                                                                translations: {},
                                                            },
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
                            name: {
                                key: "data-entry-generic-title",
                                referenceValue: "Generic training for data entry",
                                translations: {},
                            },
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
                                    icon: undefined,
                                },
                            ],
                        },
                    ],
                },
                {
                    id: "visualizing-data-page",
                    type: "page",
                    level: 1,
                    name: { key: "visualizing-data-name", referenceValue: "Visualizing data", translations: {} },
                    title: {
                        key: "visualizing-data-title",
                        referenceValue: "Learn to visualise and interpret data",
                        translations: {},
                    },
                    description: undefined,
                    icon:
                        "https://user-images.githubusercontent.com/2181866/109556711-75551680-7ad7-11eb-8ffc-3c3fec5f5156.png",
                    children: [],
                },
                {
                    id: "export-import-page",
                    type: "page",
                    level: 1,
                    name: {
                        key: "export-import-name",
                        referenceValue: "Exporting/importing data to/from Excel",
                        translations: {},
                    },
                    title: {
                        key: "export-import-title",
                        referenceValue: "Learn to export/import data to/from Excel",
                        translations: {},
                    },
                    description: undefined,
                    icon:
                        "https://user-images.githubusercontent.com/2181866/109556707-74bc8000-7ad7-11eb-9983-c32e3653a57a.png",
                    children: [],
                },
            ],
        },
    ],
};
