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

export const DatedPropertiesModel = Schema.object({
    user: NamedRefModel,
    created: Schema.date,
    lastUpdated: Schema.date,
    lastUpdatedBy: NamedRefModel,
});

export const SharingSettingModel = Schema.object({
    access: Schema.string,
    id: Schema.dhis2Id,
    name: Schema.string,
});

export const SharedPropertiesModel = Schema.object({
    publicAccess: Schema.string,
    userAccesses: Schema.array(SharingSettingModel),
    userGroupAccesses: Schema.array(SharingSettingModel),
});

export const BaseMetadataModel = Schema.extend(DatedPropertiesModel, SharedPropertiesModel);

export type Ref = GetSchemaType<typeof RefModel>;
export type NamedRef = GetSchemaType<typeof NamedRefModel>;
export type DatedProperties = GetSchemaType<typeof DatedPropertiesModel>;
export type SharedProperties = GetSchemaType<typeof SharedPropertiesModel>;
export type SharingSetting = GetSchemaType<typeof SharingSettingModel>;
export type BaseMetadata = GetSchemaType<typeof BaseMetadataModel>;
