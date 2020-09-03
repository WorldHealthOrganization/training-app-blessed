import React, { useContext } from "react";
import { D2Api } from "../../types/d2-api";

export interface AppContext {
    api: D2Api;
}

export const AppContext = React.createContext<AppContext | null>(null);

export function useAppContext() {
    const context = useContext(AppContext);
    if (context) {
        return context;
    } else {
        throw new Error("Context not found");
    }
}
