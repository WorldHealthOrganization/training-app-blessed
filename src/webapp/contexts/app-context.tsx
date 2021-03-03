import _ from "lodash";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { LandingNode } from "../../domain/entities/LandingPage";
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
    const [landings, setLandings] = useState<LandingNode[]>([]);
    const [hasSettingsAccess, setHasSettingsAccess] = useState(false);
    const [showAllModules, setShowAllModules] = useState(false);
    const translate = buildTranslate(locale);

    const reload = useCallback(async () => {
        const modules = await compositionRoot.usecases.modules.list();
        const landings = await compositionRoot.usecases.landings.list();
        const showAllModules = await compositionRoot.usecases.config.getShowAllModules();

        setModules(modules);
        setLandings(landings);
        setShowAllModules(showAllModules);
        return modules;
    }, [compositionRoot]);

    const updateAppState = useCallback((update: AppState | ((prevState: AppState) => AppState)) => {
        setAppState(prevState => {
            const nextState = _.isFunction(update) ? update(prevState) : update;
            return nextState;
        });
    }, []);

    useEffect(() => {
        reload().then(modules => cacheImages(JSON.stringify(modules)));
    }, [reload]);

    useEffect(() => {
        compositionRoot.usecases.user.checkSettingsPermissions().then(setHasSettingsAccess);
        compositionRoot.usecases.config.getShowAllModules().then(setShowAllModules);
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
                setAppState: updateAppState,
                modules,
                landings,
                translate,
                reload,
                hasSettingsAccess,
                showAllModules,
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
        landings,
        translate,
        reload,
        hasSettingsAccess,
        showAllModules,
    } = context;
    const { usecases } = compositionRoot;
    const [module, setCurrentModule] = useState<TrainingModule>();

    useEffect(() => {
        setCurrentModule(
            appState.type === "TRAINING" || appState.type === "TRAINING_DIALOG" || appState.type === "EDIT_MODULE"
                ? modules.find(({ id }) => id === appState.module)
                : undefined
        );
    }, [appState, modules]);

    return {
        appState,
        setAppState,
        routes,
        usecases,
        modules,
        landings,
        module,
        translate,
        reload,
        hasSettingsAccess,
        showAllModules,
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
    landings: LandingNode[];
    routes: AppRoute[];
    compositionRoot: CompositionRoot;
    translate: TranslateMethod;
    reload: ReloadMethod;
    hasSettingsAccess: boolean;
    showAllModules: boolean;
}

interface UseAppContextResult {
    appState: AppState;
    setAppState: (appState: AppState | AppStateUpdateMethod) => void;
    routes: AppRoute[];
    usecases: CompositionRoot["usecases"];
    modules: TrainingModule[];
    landings: LandingNode[];
    module?: TrainingModule;
    translate: TranslateMethod;
    reload: ReloadMethod;
    hasSettingsAccess: boolean;
    showAllModules: boolean;
}
