import { Codec, GetSchemaType, Schema } from "../../utils/codec";
import { TranslatableText, TranslatableTextModel } from "./TranslatableText";

export const LandingPageNodeTypeModel = Schema.oneOf([
    Schema.exact("page-group"),
    Schema.exact("page"),
    Schema.exact("module-group"),
    Schema.exact("module"),
]);

export type LandingNodeType = GetSchemaType<typeof LandingPageNodeTypeModel>;

export interface PageNode {
    id: string;
    type: "page";
    name: TranslatableText;
    icon: string;
    title: TranslatableText | undefined;
    description: TranslatableText | undefined;
    children: LandingGroupNode[];
}

export const PageNodeModel: Codec<PageNode> = Schema.object({
    id: Schema.string,
    type: Schema.exact("page"),
    name: TranslatableTextModel,
    icon: Schema.string,
    title: Schema.optional(TranslatableTextModel),
    description: Schema.optional(TranslatableTextModel),
    children: Schema.lazy(() => Schema.array(Schema.oneOf([PageGroupNodeModel, ModuleGroupNodeModel]))),
});

export const ModuleNodeModel = Schema.object({
    id: Schema.string,
    type: Schema.exact("module"),
    name: TranslatableTextModel,
    icon: Schema.undefined,
    title: Schema.undefined,
    description: Schema.undefined,
    moduleId: Schema.string,
    children: Schema.optionalSafe(Schema.array(Schema.undefined), []),
});

export const PageGroupNodeModel = Schema.object({
    id: Schema.string,
    type: Schema.exact("page-group"),
    name: TranslatableTextModel,
    icon: Schema.undefined,
    title: Schema.optional(TranslatableTextModel),
    description: Schema.optional(TranslatableTextModel),
    children: Schema.array(PageNodeModel),
});

export const ModuleGroupNodeModel = Schema.object({
    id: Schema.string,
    type: Schema.exact("module-group"),
    name: TranslatableTextModel,
    icon: Schema.undefined,
    title: Schema.optional(TranslatableTextModel),
    description: Schema.optional(TranslatableTextModel),
    children: Schema.array(ModuleNodeModel),
});

export type LandingPageGroupNode = GetSchemaType<typeof PageGroupNodeModel>;
export type LandingModuleGroupNode = GetSchemaType<typeof ModuleGroupNodeModel>;
export type LandingGroupNode = LandingPageGroupNode | LandingModuleGroupNode;
export type LandingPageNode = GetSchemaType<typeof PageNodeModel>;
export type LandingModuleNode = GetSchemaType<typeof ModuleNodeModel>;
export type LandingNode = LandingGroupNode | LandingPageNode | LandingModuleNode;
