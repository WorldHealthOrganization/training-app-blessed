import React, { useCallback, useContext, useEffect, useState } from "react";
import { TrainingModule } from "../../domain/entities/TrainingModule";
import { buildTranslate, TranslateMethod } from "../../domain/entities/TranslatableText";
import { CompositionRoot } from "../CompositionRoot";
import { AppState } from "../entities/AppState";
import { AppRoute } from "../router/AppRoute";

const AppContext = React.createContext<AppContextState | null>(null);

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
    children,
    baseUrl,
    routes,
    compositionRoot,
    locale,
}) => {
    const [appState, setAppState] = useState<AppState>({ type: "UNKNOWN" });
    const [modules, setModules] = useState<TrainingModule[]>([]);
    const [refreshKey, setRefreshKey] = useState(Math.random());
    const translate = buildTranslate(locale);

    const reload = useCallback(() => setRefreshKey(Math.random()), []);

    useEffect(() => {
        compositionRoot.usecases.modules.list().then(setModules);
    }, [compositionRoot, refreshKey]);

    return (
        <AppContext.Provider
            value={{
                baseUrl,
                routes,
                compositionRoot,
                appState,
                setAppState,
                modules,
                translate,
                reload,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export function useAppContext(): UseAppContextResult {
    const context = useContext(AppContext);
    if (!context) throw new Error("Context not initialized");

    const { compositionRoot, routes, appState, setAppState, modules, translate, reload } = context;
    const { usecases } = compositionRoot;
    const [module, setCurrentModule] = useState<TrainingModule>();

    useEffect(() => {
        if (appState.type !== "TRAINING" && appState.type !== "TRAINING_DIALOG") return;
        setCurrentModule(modules.find(({ id }) => id === appState.module));
    }, [appState, modules]);

    return {
        appState,
        setAppState,
        routes,
        usecases,
        modules,
        module,
        translate,
        reload,
    };
}

type AppStateUpdateMethod = (oldState: AppState) => AppState;
type ReloadMethod = () => void;

export interface AppContextProviderProps {
    baseUrl: string;
    routes: AppRoute[];
    compositionRoot: CompositionRoot;
    locale: string;
}

export interface AppContextState {
    appState: AppState;
    setAppState: (appState: AppState | AppStateUpdateMethod) => void;
    modules: TrainingModule[];
    baseUrl: string;
    routes: AppRoute[];
    compositionRoot: CompositionRoot;
    translate: TranslateMethod;
    reload: ReloadMethod;
}

interface UseAppContextResult {
    appState: AppState;
    setAppState: (appState: AppState | AppStateUpdateMethod) => void;
    routes: AppRoute[];
    usecases: CompositionRoot["usecases"];
    modules: TrainingModule[];
    module?: TrainingModule;
    translate: TranslateMethod;
    reload: ReloadMethod;
}
