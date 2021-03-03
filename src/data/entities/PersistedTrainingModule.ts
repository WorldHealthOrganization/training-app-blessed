import _ from "lodash";
import { NamedRef, SharingSetting } from "../../domain/entities/Ref";
import { TranslationConnection } from "../../domain/entities/TranslationProvider";
import { JSONTrainingModule } from "./JSONTrainingModule";
import { User } from "./User";

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

// Full-fledged url regexp are extremely slow, so let's use a very simple on that covers our use-cases:
//   [Some link](http://some-link.com/path?x=1)
//   [Some link](http://some-link.com/path?x=1 "Title")
//   <img src="http://some-link.com/path?x=1">
const urlRegExp = /https?:\/\/[^\\"\s)]+/g;

export function getUrls(module: PersistedTrainingModule): string[] {
    // For simplicity, process directly the JSON representation of the module
    const json = JSON.stringify(module);
    const urls = Array.from(json.matchAll(urlRegExp)).map(groups => groups[0]);
    return _(urls).compact().uniq().value();
}

export function replaceUrls(
    module: PersistedTrainingModule,
    urlMapping: Record<string, string>
): PersistedTrainingModule {
    const json = JSON.stringify(module);
    const json2 = json.replace(urlRegExp, url => urlMapping[url] || url);
    return JSON.parse(json2);
}

export function setUser(module: PersistedTrainingModule, user: User): PersistedTrainingModule {
    return {
        ...module,
        user: { id: user.id, name: user.name },
    };
}
