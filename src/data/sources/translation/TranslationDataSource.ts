import { Either } from "../../../domain/entities/Either";
import { TranslationProject } from "../../../domain/entities/Translations";
import { TranslationPoEditorDataSource } from "./TranslationPoEditorDataSource";

export type TranslationProvider = "poeditor";

export interface TranslationProviderDataSource {
    listProjects(): Promise<Either<TranslationError, TranslationProject[]>>;
}

export class TranslationDataSource implements TranslationProviderDataSource {
    public async listProjects(): Promise<Either<TranslationError, TranslationProject[]>> {
        return this.getImpl().listProjects();
    }

    private getImpl(): TranslationProviderDataSource {
        return new TranslationPoEditorDataSource();
    }
}

export type TranslationError = "UNKNOWN";
