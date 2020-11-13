import { Either } from "../../../domain/entities/Either";
import { TranslationProject } from "../../entities/Translation";

export type TranslationProvider = "poeditor";

export type TranslationError = "UNKNOWN";

export interface TranslationClient {
    getProject(id: string): Promise<Either<TranslationError, TranslationProject>>;
    createProject(): Promise<TranslationProject>;
}
