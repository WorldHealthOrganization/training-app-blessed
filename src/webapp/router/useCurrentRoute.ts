import { matchRoutes, useLocation } from "react-router-dom";
import { useAppContext } from "../contexts/app-context";
import { AppRoute } from "./AppRoute";

export function useCurrentRoute(): AppRoute | null {
    const { routes } = useAppContext();
    const location = useLocation();

    const result = matchRoutes(routes, location.pathname);
    if (!result || result.length === 0) return null;
    return result[0].route as AppRoute;
}
