import { AppState, buildPathFromState } from "../domain/entities/AppState";
import { cache } from "../utils/cache";

export class CompositionRoot {
    private currentState: AppState = { type: "UNKNOWN" };

    public get appState() {
        const path = buildPathFromState(this.currentState);
        return { ...this.currentState, path };
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
