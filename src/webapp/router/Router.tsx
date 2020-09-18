import { useConfig } from "@dhis2/app-runtime";
import React, { useEffect, useState } from "react";
import { matchRoutes, useLocation, useNavigate, useRoutes } from "react-router-dom";
import { buildPathFromState } from "../../domain/entities/AppState";
import { log } from "../../utils/debug";
import { IFrame } from "../components/iframe/IFrame";
import { useAppContext } from "../contexts/app-context";

export const Router: React.FC = () => {
    const { appState, routes } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
    const element = useRoutes(routes);
    const { baseUrl } = useConfig();

    const [startPage] = useState(location.pathname);
    const defaultRoute = routes.find(({ defaultRoute }) => defaultRoute) ?? routes[0];

    // Update path on state change
    useEffect(() => {
        if (appState.type === "UNKNOWN") return;
        const path = buildPathFromState(appState);
        navigate(path);
    }, [appState, navigate]);

    // Load state with initial path
    useEffect(() => {
        log(`[HISTORY] Start page: ${startPage}`, matchRoutes(routes, startPage));
    }, [routes, startPage]);

    return (
        <React.Fragment>
            <IFrame src={`${baseUrl}/dhis-web-dataentry/index.action`} />
            {element ?? defaultRoute.element}
        </React.Fragment>
    );
};
