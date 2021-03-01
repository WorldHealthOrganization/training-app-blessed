import { Codec, GetSchemaType, Schema } from "../../utils/codec";
import { TranslatableText, TranslatableTextModel } from "./TranslatableText";

export const LandingPageNodeTypeModel = Schema.oneOf([Schema.exact("page"), Schema.exact("module")]);

export interface LandingPageNode {
    id: string;
    type: LandingPageNodeType;
    level: number;
    name: TranslatableText;
    title: TranslatableText;
    description: TranslatableText | undefined;
    children: LandingPageNode[];
}

export const LandingPageNodeModel: Codec<LandingPageNode> = Schema.object({
    id: Schema.string,
    type: LandingPageNodeTypeModel,
    level: Schema.integer,
    name: TranslatableTextModel,
    title: TranslatableTextModel,
    description: Schema.optional(TranslatableTextModel),
    children: Schema.lazy(() => Schema.array(LandingPageNodeModel)),
});

export type LandingPageNodeType = GetSchemaType<typeof LandingPageNodeTypeModel>;

export const TempLandingPage: LandingPageNode = {
    id: "landing-page",
    type: "page",
    level: 1,
    name: { key: "landing-page-name", referenceValue: "Landing page", translations: {} },
    title: { key: "landing-page-title", referenceValue: "Landing page", translations: {} },
    description: undefined,
    children: [
        {
            id: "landing-page",
            type: "page",
            level: 1,
            name: { key: "landing-page-name", referenceValue: "Landing page", translations: {} },
            title: { key: "landing-page-title", referenceValue: "What do you want to learn in DHIS2?", translations: {} },
            description: undefined,
            children: [],
        },
    ],
};
