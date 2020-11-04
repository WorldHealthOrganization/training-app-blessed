import React, { useContext, useEffect, useState } from "react";
import { AppState } from "../../domain/entities/AppState";
import { TrainingModule } from "../../domain/entities/TrainingModule";
import { CompositionRoot } from "../CompositionRoot";
import { AppRoute } from "../router/AppRoute";

const AppContext = React.createContext<AppContextState | null>(null);

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
    children,
    baseUrl,
    routes,
    compositionRoot,
}) => {
    const [appState, setAppState] = useState<AppState>({ type: "UNKNOWN" });
    const [module, setModule] = useState<TrainingModule>();

    return (
        <AppContext.Provider
            value={{
                baseUrl,
                routes,
                compositionRoot,
                appState,
                setAppState,
                module,
                setModule,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export function useAppContext(): UseAppContextResult {
    const context = useContext(AppContext);
    if (!context) throw new Error("Context not initialized");

    const { compositionRoot, routes, appState, setAppState, module, setModule } = context;
    const { usecases } = compositionRoot;

    useEffect(() => {
        if (module) return;
        compositionRoot.usecases.getModule().then(setModule);
    }, [module, compositionRoot, setModule]);

    return { appState, setAppState, routes, usecases, module };
}

export interface AppContextProviderProps {
    baseUrl: string;
    routes: AppRoute[];
    compositionRoot: CompositionRoot;
}

export interface AppContextState {
    appState: AppState;
    setAppState: (appState: AppState | AppStateUpdateMethod) => void;
    module?: TrainingModule;
    setModule: (module: TrainingModule) => void;
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
    module?: TrainingModule;
}
