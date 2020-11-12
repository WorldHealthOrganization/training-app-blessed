import MockAdapter from "axios-mock-adapter";
import { CancelableResponse } from "./CancelableResponse";

export interface HttpClient {
    request<Data>(options: HttpRequest): CancelableResponse<Data>;
    getMockAdapter(): MockAdapter;
}

export type Method = "get" | "post" | "put" | "delete";

export type ParamValue = string | number | boolean | undefined;

export interface HttpRequest {
    method: Method;
    url: string;
    params?: Record<string, ParamValue | ParamValue[]>;
    data?: unknown;
    validateStatus?(status: number): boolean;
    timeout?: number;
}

export interface HttpResponse<Data> {
    status: number;
    data: Data;
    headers: Record<string, string>;
}

export interface Credentials {
    username: string;
    password: string;
}

export interface ConstructorOptions {
    baseUrl?: string;
    auth?: Credentials;
    timeout?: number;
}

interface HttpErrorOptions {
    request: HttpRequest;
    response?: HttpResponse<unknown>;
}

export class HttpError extends Error implements HttpErrorOptions {
    request: HttpRequest;
    response?: HttpResponse<unknown>;

    constructor(message: string, obj: HttpErrorOptions) {
        super(message);
        this.request = obj.request;
        this.response = obj.response;
    }
}
