import { Either } from "../../../domain/entities/Either";
import { cache } from "../../../utils/cache";
import { AxiosHttpClient } from "../http/AxiosHttpClient";
import { FetchHttpClient } from "../http/FetchHttpClient";
import { HttpClient } from "../http/HttpClient";
import { TranslationError } from "./TranslationClient";

export class TranslationPoEditorClient {
    private client: HttpClient;

    constructor(private apiKey: string, options: ApiOptions = {}) {
        const { apiVersion = 2, backend = "fetch" } = options;
        if (apiVersion !== 2) throw new Error(`Invalid API version: ${apiVersion}`);

        const HttpClientImpl = backend === "fetch" ? FetchHttpClient : AxiosHttpClient;

        this.client = new HttpClientImpl({
            baseUrl: `https://api.poeditor.com/v${apiVersion}/`,
        });
    }

    @cache()
    public get projects() {
        return {
            list: this.buildEndpoint("projects/list"),
            view: this.buildEndpoint("projects/view"),
            add: this.buildEndpoint("projects/add"),
            update: this.buildEndpoint("projects/update"),
            delete: this.buildEndpoint("projects/delete"),
            sync: this.buildEndpoint("projects/sync"),
            export: this.buildEndpoint("projects/export"),
        };
    }

    @cache()
    public get languages() {
        return {
            available: this.buildEndpoint("languages/available"),
            list: this.buildEndpoint("languages/list"),
            add: this.buildEndpoint("languages/add"),
            update: this.buildEndpoint("languages/update"),
            delete: this.buildEndpoint("languages/delete"),
        };
    }

    @cache()
    public get terms() {
        return {
            list: this.buildEndpoint("terms/list"),
            add: this.buildEndpoint("terms/add"),
            update: this.buildEndpoint("terms/update"),
            delete: this.buildEndpoint("terms/delete"),
            addComment: this.buildEndpoint("terms/add_comment"),
        };
    }

    @cache()
    public get translations() {
        return {
            add: this.buildEndpoint("translations/add"),
            update: this.buildEndpoint("translations/update"),
            delete: this.buildEndpoint("translations/delete"),
        };
    }

    @cache()
    public get contributors() {
        return {
            list: this.buildEndpoint("contributors/list"),
            add: this.buildEndpoint("contributors/add"),
            remove: this.buildEndpoint("contributors/remove"),
        };
    }

    public async request<T extends keyof ApiEndpoints>(
        url: T,
        requestParams?: Omit<ApiEndpoints[T]["params"], "api_token">
    ): Promise<Either<TranslationError, ApiEndpoints[T]["response"]>> {
        const { response, result } = await this.client
            .request<ApiResponse<ApiEndpoints[T]["response"]>>({
                method: "post",
                url,
                params: { api_token: this.apiKey, ...requestParams },
            })
            .getData();

        const error = this.validateStatus(response);
        return error ? Either.error(error) : Either.success(result);
    }

    private buildEndpoint<T extends keyof ApiEndpoints>(url: T) {
        return (requestParams?: Omit<ApiEndpoints[T]["params"], "api_token">) =>
            this.request(url, requestParams);
    }

    // TODO: Add all possible error codes
    private validateStatus(response: ApiResponseStatus): TranslationError | undefined {
        return response.status !== "success" ? "UNKNOWN" : undefined;
    }
}

interface ApiOptions {
    backend?: "xhr" | "fetch";
    apiVersion?: number;
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

interface ApiEndpoints {
    "projects/list": {
        params: { api_token: string };
        response: {
            projects: Array<{
                id: number;
                name: string;
                public: 0 | 1;
                open: 0 | 1;
                created: string;
            }>;
        };
    };
    "projects/view": {
        params: { api_token: string; id: number };
        response: {
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
    };
    "projects/add": {
        params: { api_token: string; name: string; description?: string };
        response: {
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
    };
    "projects/update": {
        params: {
            api_token: string;
            id: number;
            name?: string;
            description?: string;
            reference_language?: string;
        };
        response: {
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
    };
    "projects/delete": { params: { api_token: string; id: number }; response: undefined };
    "projects/sync": {
        params: {
            api_token: string;
            id: number;
            data: string;
        };
        response: {
            terms: {
                parsed: number;
                added: number;
                updated: number;
                deleted: number;
            };
        };
    };
    "projects/export": {
        params: {
            api_token: string;
            id: number;
            language: string;
            type:
                | "po"
                | "pot"
                | "mo"
                | "xls"
                | "xlsx"
                | "csv"
                | "ini"
                | "resw"
                | "resx"
                | "android_strings"
                | "apple_strings"
                | "xliff"
                | "properties"
                | "key_value_json"
                | "json"
                | "yml"
                | "xlf"
                | "xmb"
                | "xtb"
                | "arb"
                | "rise_360_xliff";
            filters?: Array<
                | "translated"
                | "untranslated"
                | "fuzzy"
                | "not_fuzzy"
                | "automatic"
                | "not_automatic"
                | "proofread"
                | "not_proofread"
            >;
            order?: "terms";
            tags: string | string[];
        };
        response: {
            url: string;
        };
    };
    "languages/available": {
        params: { api_token: string };
        response: {
            languages: Array<{
                name: string;
                code: string;
            }>;
        };
    };
    "languages/list": {
        params: { api_token: string; id: number };
        response: {
            languages: Array<{
                name: string;
                code: string;
                translations: number;
                percentage: number;
                updated: string;
            }>;
        };
    };
    "languages/add": {
        params: { api_token: string; id: number; language: string };
        response: undefined;
    };
    "languages/update": {
        params: {
            api_token: string;
            id: number;
            language: string;
            fuzzy_trigger?: 0 | 1;
            data: string;
        };
        response: {
            translations: {
                parsed: number;
                added: number;
                updated: number;
            };
        };
    };
    "languages/delete": {
        params: { api_token: string; id: number; language: string };
        response: undefined;
    };
    "terms/list": {
        params: { api_token: string; id: number; language?: string };
        response: {
            terms: Array<{
                term: string;
                context: string;
                plural: string;
                created: string;
                updated: string;
                translation: {
                    content: string;
                    fuzzy: 0 | 1;
                    proofread: 0 | 1;
                    updated: string;
                };
                reference: string;
                tags: string[];
                comment: string;
            }>;
        };
    };
    "terms/add": {
        params: { api_token: string; id: number; data: string };
        response: {
            terms: {
                parsed: number;
                added: number;
            };
        };
    };
    "terms/update": {
        params: { api_token: string; id: number; data: string; fuzzy_trigger?: 0 | 1 };
        response: {
            terms: {
                parsed: number;
                updated: number;
            };
        };
    };
    "terms/delete": {
        params: { api_token: string; id: number; data: string };
        response: {
            terms: {
                parsed: number;
                deleted: number;
            };
        };
    };
    "terms/add_comment": {
        params: { api_token: string; id: number; data: string };
        response: {
            terms: {
                parsed: number;
                with_added_comment: number;
            };
        };
    };
    "translations/add": {
        params: { api_token: string; id: number; language: string; data: string };
        response: {
            translations: {
                parsed: number;
                added: number;
            };
        };
    };
    "translations/update": {
        params: { api_token: string; id: number; language: string; data: string };
        response: {
            translations: {
                parsed: number;
                updated: number;
            };
        };
    };
    "translations/delete": {
        params: { api_token: string; id: number; language: string; data: string };
        response: {
            translations: {
                parsed: number;
                deleted: number;
            };
        };
    };
    "contributors/list": {
        params: { api_token: string; id: number; language?: string };
        response: {
            contributors: Array<{
                name: string;
                email: string;
                permissions: Array<{
                    project: { id: string; name: string };
                    type: "administrator" | "contributor";
                    proofreader: boolean;
                    languages?: string[];
                }>;
            }>;
        };
    };
    "contributors/add": {
        params: {
            api_token: string;
            id: number;
            name: string;
            email: string;
            language?: string;
            admin?: 0 | 1;
        };
        response: undefined;
    };
    "contributors/remove": {
        params: { api_token: string; id: number; email: string; language?: string };
        response: undefined;
    };
}
