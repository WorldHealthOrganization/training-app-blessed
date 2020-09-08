export interface AppRoute extends RouteObject {
    key: string;
    name: () => string;
    defaultRoute?: boolean;
}

interface RouteObject {
    caseSensitive: boolean;
    children: RouteObject[];
    element: React.ReactElement;
    path: string;
}
