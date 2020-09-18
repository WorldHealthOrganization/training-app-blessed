import _ from "lodash";

export interface AppRoute {
    key: string;
    name: () => string;
    defaultRoute?: boolean;
    element: React.ReactElement;
    paths: string[];
}

export interface ReactRouterRoute {
    caseSensitive: boolean;
    children: ReactRouterRoute[];
    element: React.ReactElement;
    path: string;
}

export const buildRoutes = (appRoutes: AppRoute[]): ReactRouterRoute[] => {
    return _.flatMap(appRoutes, ({ paths, element }) =>
        paths.map(path => ({
            path,
            element,
            caseSensitive: false,
            children: [],
        }))
    );
};
