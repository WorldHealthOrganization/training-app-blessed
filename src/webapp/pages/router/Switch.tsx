import React, { useEffect } from "react";
import { matchRoutes, useLocation, useNavigate, useRoutes } from "react-router-dom";
import { buildPathFromState } from "../../../domain/entities/AppState";
import { log } from "../../../utils/debug";
import { useAppContext } from "../../contexts/app-context";
import { AppRoute } from "./AppRoute";

export const Switch: React.FC<SwitchProps> = ({ routes }) => {
    const { appState } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
    const element = useRoutes(routes);

    const defaultRoute = routes.find(({ defaultRoute }) => defaultRoute) ?? routes[0];

    // Update path on state change
    useEffect(() => {
        if (appState.type === "UNKNOWN") return;
        const path = buildPathFromState(appState);
        navigate(path);
    }, [appState, navigate]);

    // Load state with initial path
    useEffect(() => {
        log(
            `[HISTORY] Start on page: ${location.pathname}`,
            matchRoutes(routes, location.pathname)
        );
    }, [routes, location]);

    return element ?? defaultRoute.element;
};

export interface SwitchProps {
    routes: AppRoute[];
}
