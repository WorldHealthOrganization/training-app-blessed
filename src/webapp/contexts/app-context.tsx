import React, { useCallback, useContext, useEffect, useState } from "react";
import { TrainingModule } from "../../domain/entities/TrainingModule";
import { buildTranslate, TranslateMethod } from "../../domain/entities/TranslatableText";
import { CompositionRoot } from "../CompositionRoot";
import { AppState } from "../entities/AppState";
import { AppRoute } from "../router/AppRoute";
import { cacheImages } from "../utils/image-cache";

const AppContext = React.createContext<AppContextState | null>(null);

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
    children,
    routes,
    compositionRoot,
    locale,
}) => {
    const [appState, setAppState] = useState<AppState>({ type: "UNKNOWN" });
    const [modules, setModules] = useState<TrainingModule[]>([]);
    const [hasSettingsAccess, setHasSettingsAccess] = useState(false);
    const translate = buildTranslate(locale);

    const reload = useCallback(async () => {
        const modules = await compositionRoot.usecases.modules.list();
        setModules(modules);
        return modules;
    }, [compositionRoot]);

    useEffect(() => {
        reload().then(modules => cacheImages(JSON.stringify(modules)));
    }, [reload]);

    useEffect(() => {
        compositionRoot.usecases.user.checkSuperUser().then(setHasSettingsAccess);
    }, [compositionRoot]);

    useEffect(() => {
        compositionRoot.usecases.translations.fetch().then(() => reload());
    }, [compositionRoot, reload]);

    return (
        <AppContext.Provider
            value={{
                routes,
                compositionRoot,
                appState,
                setAppState,
                modules,
                translate,
                reload,
                hasSettingsAccess,
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
        modules,
        translate,
        reload,
        hasSettingsAccess,
    } = context;
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
        hasSettingsAccess,
    };
}

type AppStateUpdateMethod = (oldState: AppState) => AppState;
type ReloadMethod = () => Promise<TrainingModule[]>;

export interface AppContextProviderProps {
    routes: AppRoute[];
    compositionRoot: CompositionRoot;
    locale: string;
}

export interface AppContextState {
    appState: AppState;
    setAppState: (appState: AppState | AppStateUpdateMethod) => void;
    modules: TrainingModule[];
    routes: AppRoute[];
    compositionRoot: CompositionRoot;
    translate: TranslateMethod;
    reload: ReloadMethod;
    hasSettingsAccess: boolean;
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
    hasSettingsAccess: boolean;
}
