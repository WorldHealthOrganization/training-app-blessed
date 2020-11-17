import { Either } from "../../../domain/entities/Either";

export interface TranslationClient {
    getProject(id: string): Promise<Either<TranslationError, TranslationProject>>;
    createProject(): Promise<TranslationProject>;
}

export type TranslationProvider = "poeditor";

export type TranslationError = "UNKNOWN";

export interface TranslationProject {
    id: string;
    name: string;
    languages: TranslationLanguage[];
}

export interface TranslationLanguage {
    id: string;
    name: string;
}
