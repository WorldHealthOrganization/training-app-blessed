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
