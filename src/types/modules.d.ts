declare module "@dhis2/d2-i18n" {
    export function t(value: string, namespace?: object): string;
    export function changeLanguage(locale: string);
}

declare module "d2" {
    import { D2 } from "./d2";

    export function init(config: { baseUrl: string; headers?: any; schemas?: string[] }): D2;
    export function generateUid(): string;
}

declare module "styled-jsx/macro" {
    export function resolve(
        chunks: TemplateStringsArray,
        ...args: any[]
    ): { className: string; styles: string };
}
