import React, { useContext } from "react";
import { AppState } from "../../domain/entities/AppState";
import { D2Api } from "../../types/d2-api";
import { CompositionRoot } from "../CompositionRoot";

export interface AppContext {
    baseUrl: string;
    api: D2Api;
    compositionRoot: CompositionRoot;
}

export const AppContext = React.createContext<AppContext | null>(null);

interface AppContextHookResult {
    baseUrl: string;
    appState: AppState;
    compositionRoot: CompositionRoot;
}

export function useAppContext(): AppContextHookResult {
    const context = useContext(AppContext);
    if (!context) throw new Error("Context not found");

    const { baseUrl, compositionRoot } = context;
    const { appState } = compositionRoot;

    return { baseUrl, appState, compositionRoot };
}
