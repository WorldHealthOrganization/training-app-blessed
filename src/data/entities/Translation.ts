import { TranslationProvider } from "../clients/translation/TranslationClient";

export interface Translation {
    id: string;
    provider: TranslationProvider;
    projectId: string;
}
