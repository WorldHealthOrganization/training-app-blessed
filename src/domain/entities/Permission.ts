import { NamedRef } from "./Ref";

export interface Permission {
    users?: NamedRef[];
    userGroups?: NamedRef[];
}
