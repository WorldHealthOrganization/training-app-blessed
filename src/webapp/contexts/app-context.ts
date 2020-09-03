import React, { useContext } from "react";
import { CompositionRoot } from "../CompositionRoot";
import { D2Api } from "../../types/d2-api";
import { AppState } from "../../domain/entities/AppState";

export interface AppContext {
    baseUrl: string;
    api: D2Api;
    compositionRoot: CompositionRoot;
}

export const AppContext = React.createContext<AppContext | null>(null);

interface AppContextHookResult {
    baseUrl: string;
    appState: AppState;
}

export function useAppContext(): AppContextHookResult {
    const context = useContext(AppContext);
    if (!context) throw new Error("Context not found");

    const { baseUrl, compositionRoot } = context;
    const { appState = buildDefaultAppState() } = compositionRoot;

    return { baseUrl, appState };
}

const buildDefaultAppState = (): AppState => {
    return {
        type: "TRAINING_DIALOG",
        dialog: "WELCOME",
    }
}