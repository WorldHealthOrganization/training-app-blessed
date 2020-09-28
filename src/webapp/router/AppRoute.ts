import _ from "lodash";
import { ReactElement, ReactNode } from "react";

export interface AppRoute {
    key: string;
    name: () => string;
    defaultRoute?: boolean;
    element: ReactElement;
    paths: string[];
    backdrop?: boolean;
}

export interface ReactRouterRoute {
    caseSensitive: boolean;
    children?: ReactRouterRoute[];
    element: ReactNode;
    path: string;
}

export interface ReactRouterMatch {
    route: ReactRouterRoute;
    pathname: string;
    params: Record<string, string>;
}

export const buildRoutes = (appRoutes: AppRoute[]): ReactRouterRoute[] => {
    return _.flatMap(appRoutes, ({ paths, element }) =>
        paths.map(path => ({ path, element, caseSensitive: false }))
    );
};
