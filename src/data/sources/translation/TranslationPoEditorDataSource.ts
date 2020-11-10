import { ParamValue } from "d2-api/repositories/HttpClientRepository";
import { Either } from "../../../domain/entities/Either";
import { TranslationLanguage, TranslationProject } from "../../../domain/entities/Translations";
import { FetchHttpClientDataSource } from "../http/FetchHttpClientDataSource";
import { HttpClientDataSource } from "../http/HttpClientDataSource";
import { TranslationError, TranslationProviderDataSource } from "./TranslationDataSource";

export class TranslationPoEditorDataSource implements TranslationProviderDataSource {
    private client: HttpClientDataSource;

    constructor() {
        this.client = new FetchHttpClientDataSource({ baseUrl: "https://api.poeditor.com/v2/" });
    }

    public async listProjects(): Promise<Either<TranslationError, TranslationProject[]>> {
        const result = await this.request<ApiResult["/projects/list"]>("/projects/list");
        if (Either.isError(result.value)) return Either.error(result.value.error);

        const languages = await this.listProjectLanguages();
        const projects = result.value.data.projects.map(({ id, name }) => ({
            id: String(id),
            name,
            languages,
        }));

        return Either.success(projects);
    }

    private async request<T>(
        url: string,
        requestParams: Record<string, ParamValue | ParamValue[]> = {}
    ): Promise<Either<TranslationError, T>> {
        const params = { api_token: "b3b4cb367a4b19fd7ef81191b1b541c3", ...requestParams };
        const { response, result } = await this.client
            .request<ApiResponse<T>>({ method: "post", url, params })
            .getData();

        const error = this.validateStatus(response);
        if (error) return Either.error(error);

        return Either.success(result);
    }

    private validateStatus(response: ApiResponseStatus): TranslationError | undefined {
        return response.status !== "success" ? "UNKNOWN" : undefined;
    }

    private async listProjectLanguages(): Promise<TranslationLanguage[]> {
        const result = await this.request<ApiResult["/languages/list"]>("/languages/list");
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
}
