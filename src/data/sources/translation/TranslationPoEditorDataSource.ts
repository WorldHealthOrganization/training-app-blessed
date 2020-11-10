import { ParamValue } from "d2-api/repositories/HttpClientRepository";
import { Either } from "../../../domain/entities/Either";
import { TrainingModule } from "../../../domain/entities/TrainingModule";
import { TranslationLanguage, TranslationProject } from "../../../domain/entities/Translations";
import { FetchHttpClientDataSource } from "../http/FetchHttpClientDataSource";
import { HttpClientDataSource } from "../http/HttpClientDataSource";
import { TranslationError, TranslationProviderDataSource } from "./TranslationDataSource";

export class TranslationPoEditorDataSource implements TranslationProviderDataSource {
    private client: HttpClientDataSource;

    constructor() {
        this.client = new FetchHttpClientDataSource({ baseUrl: "https://api.poeditor.com/v2/" });
    }

    public async createProject(
        trainingModule: TrainingModule
    ): Promise<Either<TranslationError, TranslationProject>> {
        const addProjectResponse = await this.request("projects/add", {
            name: trainingModule.name,
        });

        if (Either.isError(addProjectResponse.value)) {
            return Either.error(addProjectResponse.value.error);
        }

        const { id } = addProjectResponse.value.data.project;

        const addLanguageResponse = await this.request("languages/add", {
            id,
            language: "en",
        });

        if (Either.isError(addLanguageResponse.value)) {
            return Either.error(addLanguageResponse.value.error);
        }

        // TODO: Add terms + Import translations

        return Either.success({
            id: String(id),
            name,
            languages: [
                {
                    id: "en",
                    name: "English",
                },
            ],
        });
    }

    public async listProjects(): Promise<Either<TranslationError, TranslationProject[]>> {
        const result = await this.request("/projects/list");
        if (Either.isError(result.value)) return Either.error(result.value.error);

        const languages = await this.listProjectLanguages();
        const projects = result.value.data.projects.map(({ id, name }) => ({
            id: String(id),
            name,
            languages,
        }));

        return Either.success(projects);
    }

    private async request<T extends keyof ApiResult>(
        url: T,
        requestParams: Record<string, ParamValue | ParamValue[]> = {}
    ): Promise<Either<TranslationError, ApiResult[T]>> {
        const params = { api_token: "b3b4cb367a4b19fd7ef81191b1b541c3", ...requestParams };
        const { response, result } = await this.client
            .request<ApiResponse<ApiResult[T]>>({ method: "post", url, params })
            .getData();

        const error = this.validateStatus(response);
        if (error) return Either.error(error);

        return Either.success(result);
    }

    private validateStatus(response: ApiResponseStatus): TranslationError | undefined {
        return response.status !== "success" ? "UNKNOWN" : undefined;
    }

    private async listProjectLanguages(): Promise<TranslationLanguage[]> {
        const result = await this.request("/languages/list");
        if (Either.isError(result.value)) return [];

        const { languages } = result.value.data;
        return languages.map(({ code, name }) => ({ id: code, name }));
    }
}

interface ApiResponse<T> {
    result: T;
    response: ApiResponseStatus;
}

interface ApiResponseStatus {
    status: "success" | "fail";
    code: string;
    message: string;
}

interface ApiResult {
    "languages/add": undefined;
    "/projects/list": {
        projects: Array<{
            id: number;
            name: string;
            public: 0 | 1;
            open: 0 | 1;
            created: string;
        }>;
    };
    "/languages/list": {
        languages: Array<{
            name: string;
            code: string;
            translations: number;
            percentage: number;
            updated: string;
        }>;
    };
    "projects/add": {
        project: {
            id: number;
            name: string;
            description: string;
            public: 0 | 1;
            open: 0 | 1;
            reference_language: string;
            terms: number;
            created: string;
        };
    };
}
