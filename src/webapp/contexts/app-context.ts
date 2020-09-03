import React, { useContext } from "react";
import { CompositionRoot } from "../CompositionRoot";
import { D2Api } from "../../types/d2-api";

export interface AppContext {
    baseUrl: string;
    api: D2Api;
    compositionRoot: CompositionRoot;
}

export const AppContext = React.createContext<AppContext | null>(null);

interface AppContextHookResult {}

export function useAppContext(): AppContextHookResult {
    const context = useContext(AppContext);
    if (!context) throw new Error("Context not found");

    return {};
}
