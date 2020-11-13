import AbortController from "abort-controller";
import MockAdapter from "axios-mock-adapter";
import btoa from "btoa";
import "isomorphic-fetch";
import _ from "lodash";
import qs from "qs";
import { CancelableResponse } from "./CancelableResponse";
import {
    ConstructorOptions,
    getBody,
    HttpClient,
    HttpError,
    HttpRequest,
    HttpResponse,
} from "./HttpClient";

export class FetchHttpClient implements HttpClient {
    constructor(public options: ConstructorOptions) {}

    request<Data>(options: HttpRequest): CancelableResponse<Data> {
        const controller = new AbortController();
        const { baseUrl = "", auth, credentials } = this.options;
        const timeout = options.timeout || this.options.timeout;
        const {
            method,
            url,
            params,
            data,
            dataType = "raw",
            headers: extraHeaders = {},
            validateStatus = validateStatus2xx,
        } = options;

        const baseHeaders: Record<string, string> = {
            Accept: "application/json, text/plain",
        };

        const authHeaders: Record<string, string> = auth
            ? { Authorization: "Basic " + btoa(auth.username + ":" + auth.password) }
            : {};

        const credentialsStrategy = auth ? "omit" : "include";
        const fetchOptions: RequestInit = {
            method,
            signal: controller.signal,
            body: getBody(dataType, data),
            headers: { ...baseHeaders, ...authHeaders, ...extraHeaders },
            credentials: credentials === "include" ? credentialsStrategy : undefined,
        };

        const fullUrl = joinPath(baseUrl, url) + getQueryStrings(params);

        // Fetch API has no timeout mechanism, implement with a setTimeout + controller.abort
        const timeoutId = timeout ? setTimeout(() => controller.abort(), timeout) : null;
        const fetchResponse = fetch(fullUrl, fetchOptions);

        const response: Promise<HttpResponse<Data>> = fetchResponse
            .then(async res => {
                const dataIsJson = (res.headers.get("content-type") || "").includes("json");
                const data = (await (dataIsJson ? res.json() : res.text())) as Data;
                if (!validateStatus(res.status)) raiseHttpError(options, res, data);
                return { status: res.status, data: data, headers: getHeadersRecord(res.headers) };
            })
            .catch(error => {
                if (error.request) throw error;
                throw new HttpError(error.toString(), { request: options });
            })
            .finally(() => (timeoutId !== null ? clearTimeout(timeoutId) : null));

        return CancelableResponse.build({ response, cancel: () => controller.abort() });
    }

    getMockAdapter(): MockAdapter {
        throw new Error("Not implemented");
    }
}

type Value = string | number | boolean | undefined;

function getQueryStrings(params: Record<string, Value | Value[]> | undefined): string {
    if (_.isEmpty(params)) {
        return "";
    } else {
        return "?" + qs.stringify(params, { arrayFormat: "repeat" });
    }
}

function validateStatus2xx(status: number) {
    return status >= 200 && status < 300;
}

function raiseHttpError(request: HttpRequest, response: Response, body: unknown): Promise<void> {
    throw new HttpError(response.statusText, {
        request,
        response: {
            status: response.status,
            headers: getHeadersRecord(response.headers),
            data: body,
        },
    });
}

function getHeadersRecord(headers: Headers) {
    return headers ? _.fromPairs(Array.from(headers.entries())) : {};
}

function joinPath(...parts: (string | undefined | null)[]): string {
    return _(parts)
        .map(part => (part ? part.replace(/^\/+|\/+$/g, "") : null))
        .compact()
        .join("/");
}
