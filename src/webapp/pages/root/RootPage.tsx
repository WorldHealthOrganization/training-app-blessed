import React from "react";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import i18n from "../../../locales";
import { BasePage } from "../base/BasePage";

export interface AppRoute {
    key: string;
    path: string;
    name: () => string;
    section: string;
    defaultRoute?: boolean;
    component: (props: unknown) => React.ReactElement | null;
}

export const userRoutes: AppRoute[] = [
    {
        key: "home",
        name: () => i18n.t("Home"),
        path: "/",
        section: "main",
        defaultRoute: true,
        component: BasePage,
    },
    {
        key: "settings",
        name: () => i18n.t("Settings"),
        path: "/settings",
        section: "settings",
        component: () => <p>Hi</p>,
    },
];

const Root = () => {
    const defaultRoute = userRoutes.find(({ defaultRoute }) => defaultRoute) ?? userRoutes[0];

    return (
        <HashRouter>
            <Switch>
                {userRoutes.map(AppRoute)}

                {defaultRoute && (
                    <Route
                        exact={true}
                        path={"/"}
                        render={() => <Redirect to={defaultRoute.path} />}
                    />
                )}
            </Switch>
        </HashRouter>
    );
};

const AppRoute = ({ key, path, component }: AppRoute) => {
    return (
        <Route key={key} path={path}>
            {component({})}
        </Route>
    );
};

export default Root;
