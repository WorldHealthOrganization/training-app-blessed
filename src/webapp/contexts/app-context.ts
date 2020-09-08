import React, { useContext } from "react";
import { AppState } from "../../domain/entities/AppState";
import { CompositionRoot } from "../CompositionRoot";
import { AppRoute } from "../router/AppRoute";

export interface AppContext {
    baseUrl: string;
    routes: AppRoute[];
    compositionRoot: CompositionRoot;
}

export const AppContext = React.createContext<AppContext | null>(null);

interface AppContextHookResult extends AppContext {
    appState: AppState;
}

export function useAppContext(): AppContextHookResult {
    const context = useContext(AppContext);
    if (!context) throw new Error("Context not found");

    const { compositionRoot } = context;
    const { appState } = compositionRoot;

    return { ...context, appState };
}
