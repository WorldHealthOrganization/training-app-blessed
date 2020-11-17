export interface TranslatableText {
    key: string;
    referenceValue: string;
    translations: Record<string, string>;
}

export const buildTranslate = (locale: string): TranslateMethod => {
    return (text: TranslatableText): string => {
        const translations = text.translations ?? {};
        return translations[locale] ?? text.referenceValue;
    };
};

export type TranslateMethod = (string: TranslatableText) => string;
