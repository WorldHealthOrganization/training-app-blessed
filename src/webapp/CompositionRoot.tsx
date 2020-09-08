import { AppState } from "../domain/entities/AppState";
import { D2Api } from "../types/d2-api";
import { cache } from "../utils/cache";

export class CompositionRoot {
    private currentState: AppState = { type: "UNKNOWN" };

    constructor(public readonly api: D2Api) {}

    public get appState() {
        return this.currentState;
    }

    public updateAppState(appState: AppState) {
        this.currentState = appState;
    }

    @cache()
    public get usecases() {
        return getExecute({});
    }
}

function getExecute<UseCases extends Record<Key, UseCase>, Key extends keyof UseCases>(
    useCases: UseCases
): { [K in Key]: UseCases[K]["execute"] } {
    const keys = Object.keys(useCases) as Key[];
    const initialOutput = {} as { [K in Key]: UseCases[K]["execute"] };

    return keys.reduce((output, key) => {
        const useCase = useCases[key];
        const execute = useCase.execute.bind(useCase) as UseCases[typeof key]["execute"];
        output[key] = execute;
        return output;
    }, initialOutput);
}

export interface UseCase {
    execute: Function;
}
