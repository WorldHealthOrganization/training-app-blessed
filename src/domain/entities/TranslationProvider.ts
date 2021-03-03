import { Schema, GetSchemaType } from "../../utils/codec";

export const TranslationProvidersModel = Schema.oneOf([Schema.exact("poeditor")]);

export const TranslationConnectionModel = Schema.oneOf([
    Schema.object({
        provider: TranslationProvidersModel,
        project: Schema.string,
    }),
    Schema.object({
        provider: Schema.exact("NONE"),
    }),
]);

export type TranslationConnection = GetSchemaType<typeof TranslationConnectionModel>;
export type TranslationProviders = GetSchemaType<typeof TranslationProvidersModel>;
