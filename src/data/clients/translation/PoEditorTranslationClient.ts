import { Either } from "../../../domain/entities/Either";
import { TranslationProject } from "../../entities/Translation";
import { PoEditorApi } from "./PoEditorApi";
import { TranslationClient, TranslationError } from "./TranslationClient";

export class PoEditorTranslationClient implements TranslationClient {
    private api: PoEditorApi;

    constructor() {
        // TODO: Read from config
        this.api = new PoEditorApi("c65f9e166fbb540c37b1f8a3cb088ac3");
    }

    public async getProject(
        projectId: string
    ): Promise<Either<TranslationError, TranslationProject>> {
        const id = parseInt(projectId);
        if (!id) return Either.error("UNKNOWN");

        const projectView = await this.api.projects.view({ id });
        const projectLanguages = await this.api.languages.list({ id });

        return Either.map2([projectView, projectLanguages], ({ project }, { languages }) => {
            return {
                ...project,
                id: String(project.id),
                languages: languages.map(({ name, code }) => ({ id: code, name })),
            };
        });
    }

    createProject(): Promise<TranslationProject> {
        // Create project
        // Add reference language
        // Set default reference language
        throw new Error("Method not implemented.");
    }
}
