import React, { useContext, useState } from "react";
import { AppState } from "../../domain/entities/AppState";
import { CompositionRoot } from "../CompositionRoot";
import { AppRoute } from "../router/AppRoute";

export interface AppContext {
    baseUrl: string;
    routes: AppRoute[];
    compositionRoot: CompositionRoot;
}

export const AppContext = React.createContext<AppContext | null>(null);

interface AppContextHookResult {
    appState: AppState;
    setAppState: (appState: AppState) => void;
    routes: AppRoute[];
    usecases: CompositionRoot["usecases"];
}

export function useAppContext(): AppContextHookResult {
    const context = useContext(AppContext);
    if (!context) throw new Error("Context not found");

    const [appState, setAppState] = useState<AppState>({ type: "UNKNOWN" });
    const { compositionRoot, routes } = context;
    const { usecases } = compositionRoot;

    return { appState, setAppState, routes, usecases };
}
