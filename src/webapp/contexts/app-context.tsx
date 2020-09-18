import React, { useContext, useState } from "react";
import { AppState } from "../../domain/entities/AppState";
import { CompositionRoot } from "../CompositionRoot";
import { AppRoute } from "../router/AppRoute";

const AppContext = React.createContext<AppContext | null>(null);

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
    children,
    baseUrl,
    routes,
    compositionRoot,
}) => {
    const [appState, setAppState] = useState<AppState>({ type: "MAIN_DIALOG", dialog: "overview" });

    return (
        <AppContext.Provider value={{ baseUrl, routes, compositionRoot, appState, setAppState }}>
            {children}
        </AppContext.Provider>
    );
};

export function useAppContext(): UseAppContextResult {
    const context = useContext(AppContext);
    if (!context) throw new Error("Context not initialized");

    const { compositionRoot, routes, appState, setAppState } = context;
    const { usecases } = compositionRoot;

    return { appState, setAppState, routes, usecases };
}

export interface AppContextProviderProps {
    baseUrl: string;
    routes: AppRoute[];
    compositionRoot: CompositionRoot;
}

export interface AppContext {
    appState: AppState;
    setAppState: (appState: AppState | AppStateUpdateMethod) => void;
    baseUrl: string;
    routes: AppRoute[];
    compositionRoot: CompositionRoot;
}

type AppStateUpdateMethod = (oldState: AppState) => AppState;

interface UseAppContextResult {
    appState: AppState;
    setAppState: (appState: AppState | AppStateUpdateMethod) => void;
    routes: AppRoute[];
    usecases: CompositionRoot["usecases"];
}
