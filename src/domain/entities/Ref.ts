import { GetSchemaType, Schema } from "../../utils/codec";

export const RefModel = Schema.object({
    id: Schema.dhis2Id,
});

export const NamedRefModel = Schema.extend(
    RefModel,
    Schema.object({
        name: Schema.string,
    })
);

export const DatedRefModel = Schema.extend(
    NamedRefModel,
    Schema.object({
        user: NamedRefModel,
        created: Schema.date,
        lastUpdated: Schema.date,
        lastUpdatedBy: NamedRefModel,
    })
);

export const SharingSettingModel = Schema.object({
    access: Schema.string,
    id: Schema.dhis2Id,
    name: Schema.string,
});

export const SharedRefModel = Schema.extend(
    DatedRefModel,
    Schema.object({
        publicAccess: Schema.string,
        userAccesses: Schema.array(SharingSettingModel),
        userGroupAccesses: Schema.array(SharingSettingModel),
    })
);

export type Ref = GetSchemaType<typeof RefModel>;
export type NamedRef = GetSchemaType<typeof NamedRefModel>;
export type DatedRef = GetSchemaType<typeof DatedRefModel>;
export type SharedRef = GetSchemaType<typeof SharedRefModel>;
export type SharingSetting = GetSchemaType<typeof SharingSettingModel>;
