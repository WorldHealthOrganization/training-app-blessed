import _ from "lodash";
import { Codec, GetSchemaType, Schema } from "../../utils/codec";
import { TranslatableText, TranslatableTextModel } from "./TranslatableText";

export const LandingPageNodeTypeModel = Schema.oneOf([
    Schema.exact("root"),
    Schema.exact("section"),
    Schema.exact("sub-section"),
    Schema.exact("category"),
]);

export type LandingNodeType = GetSchemaType<typeof LandingPageNodeTypeModel>;
// Full-fledged url regexp are extremely slow, so let's use a very simple on that covers our use-cases:
//   [Some link](http://some-link.com/path?x=1)
//   [Some link](http://some-link.com/path?x=1 "Title")
//   <img src="http://some-link.com/path?x=1">
const urlRegExp = /https?:\/\/[^\\"\s)]+/g;

export function getUrls(landingPage: LandingNode): string[] {
    // For simplicity, process directly the JSON representation of the module
    const json = JSON.stringify(landingPage);
    const urls = Array.from(json.matchAll(urlRegExp)).map(groups => groups[0]);
    return _(urls).compact().uniq().value();
}

export function replaceUrls(
    landingPage: LandingNode,
    urlMapping: Record<string, string>
): LandingNode {
    const json = JSON.stringify(landingPage);
    const json2 = json.replace(urlRegExp, url => urlMapping[url] || url);
    return JSON.parse(json2);
}

export interface LandingNode {
    id: string;
    parent: string;
    type: LandingNodeType;
    icon: string;
    order: number | undefined;
    name: TranslatableText;
    title: TranslatableText | undefined;
    content: TranslatableText | undefined;
    modules: string[];
    children: LandingNode[];
}

export const LandingNodeModel: Codec<LandingNode> = Schema.object({
    id: Schema.string,
    parent: Schema.string,
    type: LandingPageNodeTypeModel,
    icon: Schema.optionalSafe(Schema.string, ""),
    order: Schema.optional(Schema.integer),
    name: TranslatableTextModel,
    title: Schema.optional(TranslatableTextModel),
    content: Schema.optional(TranslatableTextModel),
    modules: Schema.optionalSafe(Schema.array(Schema.string), []),
    children: Schema.lazy(() => Schema.array(LandingNodeModel)),
});
