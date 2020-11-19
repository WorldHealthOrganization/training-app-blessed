export interface Ref {
    id: string;
}

export interface NamedRef extends Ref {
    name: string;
}

export interface DatedRef extends NamedRef {
    user: NamedRef;
    created: Date;
    lastUpdated: Date;
    lastUpdatedBy: NamedRef;
}

export interface SharedRef extends DatedRef {
    publicAccess: string;
    userAccesses: SharingSetting[];
    userGroupAccesses: SharingSetting[];
}

export interface SharingSetting {
    access: string;
    id: string;
    name: string;
}
