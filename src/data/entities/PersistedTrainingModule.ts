import { SharingSetting, NamedRef } from "../../domain/entities/Ref";
import { TranslationProvider } from "../clients/translation/TranslationClient";
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
}

export type TranslationConnection =
    | {
          provider: TranslationProvider;
          project: string;
      }
    | { provider: "NONE" };
