import { Codec, GetSchemaType, Schema } from "../../utils/codec";
import { TranslatableText, TranslatableTextModel } from "./TranslatableText";

export const LandingPageNodeTypeModel = Schema.oneOf([
    Schema.exact("root"),
    Schema.exact("section"),
    Schema.exact("sub-section"),
    Schema.exact("category"),
]);

export type LandingNodeType = GetSchemaType<typeof LandingPageNodeTypeModel>;

export interface LandingNode {
    id: string;
    parent: string;
    type: LandingNodeType;
    icon: string;
    title: TranslatableText;
    content: TranslatableText | undefined;
    modules: string[];
    children: LandingNode[];
}

export const LandingNodeModel: Codec<LandingNode> = Schema.object({
    id: Schema.string,
    parent: Schema.string,
    type: LandingPageNodeTypeModel,
    icon: Schema.optionalSafe(Schema.string, ""),
    title: TranslatableTextModel,
    content: Schema.optional(TranslatableTextModel),
    modules: Schema.optionalSafe(Schema.array(Schema.string), []),
    children: Schema.lazy(() => Schema.array(LandingNodeModel)),
});
