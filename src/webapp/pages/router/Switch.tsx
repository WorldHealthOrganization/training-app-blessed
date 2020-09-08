import React, { useEffect } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { buildPathFromState } from "../../../domain/entities/AppState";
import { useAppContext } from "../../contexts/app-context";

export const RouterSwitch: React.FC<RouterSwitchProps> = ({ routes }) => {
    const { appState } = useAppContext();
    const history = useHistory();

    const defaultRoute = routes.find(({ defaultRoute }) => defaultRoute) ?? routes[0];

    // Update path on state change
    useEffect(() => {
        if (appState.type === "UNKNOWN") return;
        const path = buildPathFromState(appState);
        history.push(path);
    }, [appState, history]);

    // Load state with initial path
    useEffect(() => {
        console.log(`[HISTORY] Start on page: ${history.location.pathname}`);

        // Detect path changes
        return history.listen(location => {
            console.log(`[HISTORY] You changed the page to: ${location.pathname}`);
        });
    }, [history]);

    return (
        <Switch>
            {routes.map(({ key, path, component }) => (
                <Route key={key} path={path}>
                    {component({})}
                </Route>
            ))}

            {defaultRoute && (
                <Route exact={true} path={"/"} render={() => <Redirect to={defaultRoute.path} />} />
            )}
        </Switch>
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
