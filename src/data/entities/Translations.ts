export interface TranslationProject {
    id: string;
    name: string;
    languages: TranslationLanguage[];
}

export interface TranslationLanguage {
    id: string;
    name: string;
}
