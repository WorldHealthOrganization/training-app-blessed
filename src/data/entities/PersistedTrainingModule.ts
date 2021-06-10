import _ from "lodash";
import { NamedRef, SharingSetting } from "../../domain/entities/Ref";
import { JSONTrainingModule } from "./JSONTrainingModule";

export interface PersistedTrainingModule extends JSONTrainingModule {
    publicAccess: string;
    userAccesses: SharingSetting[];
    userGroupAccesses: SharingSetting[];
    user: NamedRef;
    created: string;
    lastUpdated: string;
    lastUpdatedBy: NamedRef;
}
