export interface TranslatableText {
    key: string;
    referenceValue: string;
    translations: Record<string, string>;
}

export const translate = (text: TranslatableText, locale: string): string => {
    return text.translations[locale] ?? text.referenceValue;
};
