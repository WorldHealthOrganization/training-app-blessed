import { useConfig } from "@dhis2/app-runtime";
import React, { useEffect, useState } from "react";
import { matchRoutes, useLocation, useNavigate, useRoutes } from "react-router-dom";
import { buildPathFromState } from "../../domain/entities/AppState";
import { log } from "../../utils/debug";
import { IFrame } from "../components/iframe/IFrame";
import { useAppContext } from "../contexts/app-context";
import { buildRoutes } from "./AppRoute";

export const Router: React.FC = () => {
    const { appState, routes } = useAppContext();
    const { baseUrl } = useConfig();
    const navigate = useNavigate();
    const location = useLocation();

    const routerRoutes = buildRoutes(routes);
    const element = useRoutes(routerRoutes);

    const [startPage] = useState(location.pathname);
    const defaultRoute = routes.find(({ defaultRoute }) => defaultRoute) ?? routes[0];

    // Update path on state change
    useEffect(() => {
        const path = buildPathFromState(appState);
        if (path !== location.pathname) navigate(path);
    }, [appState, navigate, location.pathname]);

    // TODO: Load state with initial path
    useEffect(() => {
        log(`[HISTORY] Start page: ${startPage}`, matchRoutes(routerRoutes, startPage));
    }, [routerRoutes, startPage]);

    return (
        <React.Fragment>
            <IFrame src={`${baseUrl}/dhis-web-dataentry/index.action`} />
            {element ?? defaultRoute.element}
        </React.Fragment>
    );
};
