import React from "react";
import { HashRouter, Redirect, Route, Switch, useHistory, useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/app-context";

export const RouterSwitch: React.FC<RouterSwitchProps> = ({ routes }) => {
    const { appState } = useAppContext();
    const params = useParams();
    const history = useHistory();

    const defaultRoute = routes.find(({ defaultRoute }) => defaultRoute) ?? routes[0];

    console.log("router", { appState, params, history });

    return (
        <HashRouter>
            <Switch>
                {routes.map(({ key, path, component }) => (
                    <Route key={key} path={path}>
                        {component({})}
                    </Route>
                ))}

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

export interface AppRoute {
    key: string;
    path: string;
    name: () => string;
    section: string;
    defaultRoute?: boolean;
    component: (props: unknown) => React.ReactElement | null;
}

export interface RouterSwitchProps {
    routes: AppRoute[];
}
