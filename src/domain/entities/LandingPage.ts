import { Codec, GetSchemaType, Schema } from "../../utils/codec";
import { TranslatableText, TranslatableTextModel } from "./TranslatableText";

export const LandingPageNodeTypeModel = Schema.oneOf([
    Schema.exact("page-group"),
    Schema.exact("page"),
    Schema.exact("module-group"),
    Schema.exact("module"),
]);

export type LandingNodeType = GetSchemaType<typeof LandingPageNodeTypeModel>;

export interface LandingNode {
    id: string;
    parent: string;
    type: LandingNodeType;
    name: TranslatableText;
    icon: string;
    title: TranslatableText | undefined;
    description: TranslatableText | undefined;
    children: LandingNode[];
    moduleId: string;
}

export const LandingNodeModel: Codec<LandingNode> = Schema.object({
    id: Schema.string,
    parent: Schema.string,
    type: LandingPageNodeTypeModel,
    name: TranslatableTextModel,
    icon: Schema.optionalSafe(Schema.string, ""),
    title: Schema.optional(TranslatableTextModel),
    description: Schema.optional(TranslatableTextModel),
    children: Schema.lazy(() => Schema.array(LandingNodeModel)),
    moduleId: Schema.optionalSafe(Schema.string, ""),
});
