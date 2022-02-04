import React, { useCallback, useEffect, useMemo, useState } from "react";
import { matchRoutes, useLocation, useNavigate, useRoutes } from "react-router-dom";
import styled from "styled-components";
import { ActionButton } from "../components/action-button/ActionButton";
import { IFrame } from "../components/iframe/IFrame";
import { useAppContext } from "../contexts/app-context";
import { buildPathFromState, buildStateFromPath } from "../entities/AppState";
import { ExitPage } from "../pages/exit/ExitPage";
import { AppRoute, buildRoutes } from "./AppRoute";

export const Router: React.FC<{ baseUrl: string }> = ({ baseUrl }) => {
    const { appState, routes, setAppState, module, reload } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    const routerRoutes = useMemo(() => buildRoutes(routes), [routes]);
    const element = useRoutes(routerRoutes);

    const [startPage] = useState(location.pathname);
    const defaultRoute = routes.find(({ defaultRoute }) => defaultRoute) ?? routes[0];

    const hasProperty = useCallback(
        (property: keyof AppRoute) => {
            const match = matchRoutes(routerRoutes, location.pathname);
            const path = match && match[0] ? match[0].route.path : "";
            const route = routes.find(({ paths }) => paths.includes(path));
            return route && route[property];
        },
        [routes, routerRoutes, location.pathname]
    );

    const mainComponent = useMemo(() => {
        if (appState.exit) {
            return <ExitPage />;
        }

        if (appState.minimized) {
            return <ActionButton onClick={() => setAppState(appState => ({ ...appState, minimized: false }))} />;
        }

        return element ?? defaultRoute?.element;
    }, [appState, setAppState, element, defaultRoute]);

    // Update path on state change
    useEffect(() => {
        if (appState.type === "UNKNOWN") {
            return;
        } else {
            const path = buildPathFromState(appState);
            if (path !== location.pathname) navigate(path);
        }
    }, [appState, navigate, location, baseUrl]);

    // Load state with initial path
    useEffect(() => {
        const match = matchRoutes(routerRoutes, startPage);
        if (match) {
            setAppState(buildStateFromPath(match));
            reload();
        }
    }, [routerRoutes, startPage, setAppState, reload]);

    return (
        <React.Fragment>
            {hasProperty("iframe") && <IFrame src={`${baseUrl}${module?.dhisLaunchUrl ?? ""}`} />}
            {hasProperty("backdrop") && !appState.minimized ? <Backdrop /> : null}
            {mainComponent}
        </React.Fragment>
    );
};

const Backdrop = styled.div`
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    text-align: center;
    background-color: rgba(39, 102, 150, 0.3);
`;
