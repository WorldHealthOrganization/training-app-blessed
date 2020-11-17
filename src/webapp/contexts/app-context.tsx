import React, { useContext, useEffect, useRef, useState } from "react";
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
    const [module, setModule] = useState<TrainingModule>();
    const translate = buildTranslate(locale);

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
                translate,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export function useAppContext(): UseAppContextResult {
    const context = useContext(AppContext);
    if (!context) throw new Error("Context not initialized");

    const {
        compositionRoot,
        routes,
        appState,
        setAppState,
        module,
        setModule,
        translate,
    } = context;
    const { usecases } = compositionRoot;
    const stateModule = useRef<string>();

    useEffect(() => {
        if (module && stateModule.current === module.id) return;
        if (appState.type !== "TRAINING" && appState.type !== "TRAINING_DIALOG") return;
        compositionRoot.usecases.modules.get(appState.module).then(setModule);
        stateModule.current = appState.module;
    }, [appState, module, compositionRoot, setModule]);

    return { appState, setAppState, routes, usecases, module, translate };
}

export interface AppContextProviderProps {
    baseUrl: string;
    routes: AppRoute[];
    compositionRoot: CompositionRoot;
    locale: string;
}

export interface AppContextState {
    appState: AppState;
    setAppState: (appState: AppState | AppStateUpdateMethod) => void;
    module?: TrainingModule;
    setModule: (module: TrainingModule) => void;
    baseUrl: string;
    routes: AppRoute[];
    compositionRoot: CompositionRoot;
    translate: TranslateMethod;
}

type AppStateUpdateMethod = (oldState: AppState) => AppState;

interface UseAppContextResult {
    appState: AppState;
    setAppState: (appState: AppState | AppStateUpdateMethod) => void;
    routes: AppRoute[];
    usecases: CompositionRoot["usecases"];
    module?: TrainingModule;
    translate: TranslateMethod;
}
