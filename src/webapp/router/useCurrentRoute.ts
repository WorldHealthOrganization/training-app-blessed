import { matchRoutes, useLocation } from "react-router-dom";
import { useAppContext } from "../contexts/app-context";
import { AppRoute, buildRoutes } from "./AppRoute";

export function useCurrentRoute(): AppRoute | null {
    const { routes } = useAppContext();
    const location = useLocation();

    const result = matchRoutes(buildRoutes(routes), location.pathname);
    if (!result || result.length === 0) return null;

    return routes.find(({ paths }) => paths.includes(result[0]?.route.path ?? "")) ?? null;
}
