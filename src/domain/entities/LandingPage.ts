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
});

export interface PageNode {
    id: string;
    type: "page";
    name: TranslatableText;
    icon: string;
    title: TranslatableText | undefined;
    description: TranslatableText | undefined;
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
