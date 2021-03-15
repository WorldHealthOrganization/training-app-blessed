import _ from "lodash";
import { NamedRef, SharingSetting } from "../../domain/entities/Ref";
import { TranslationConnection } from "../../domain/entities/TranslationProvider";
import { JSONTrainingModule } from "./JSONTrainingModule";

export interface PersistedTrainingModule extends JSONTrainingModule {
    translation: TranslationConnection;
    publicAccess: string;
    userAccesses: SharingSetting[];
    userGroupAccesses: SharingSetting[];
    user: NamedRef;
    created: string;
    lastUpdated: string;
    lastUpdatedBy: NamedRef;
    lastTranslationSync: string;
}
const urlRegExp = /https?:\/\/[^\\"\s)]+/g;

export function getUrls(landingPage: PersistedTrainingModule): string[] {
    // For simplicity, process directly the JSON representation of the module
    const json = JSON.stringify(landingPage);
    const urls = Array.from(json.matchAll(urlRegExp)).map(groups => groups[0]);
    return _(urls).compact().uniq().value();
}

export function replaceUrls(
    landingPage: PersistedTrainingModule,
    urlMapping: Record<string, string>
): PersistedTrainingModule {
    const json = JSON.stringify(landingPage);
    const json2 = json.replace(urlRegExp, url => urlMapping[url] || url);
    return JSON.parse(json2);
}
