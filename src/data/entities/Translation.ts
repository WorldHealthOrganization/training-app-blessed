import { TranslationProvider } from "../clients/translation/TranslationClient";

export interface Translation {
    id: string;
    provider: TranslationProvider;
    projectId: string;
}

export interface TranslationProject {
    id: string;
    name: string;
    languages: TranslationLanguage[];
}

export interface TranslationLanguage {
    id: string;
    name: string;
}
