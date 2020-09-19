import { log } from "../../utils/debug";
import { ReactRouterMatch } from "../../webapp/router/AppRoute";

export type AppStateType = "HOME" | "TRAINING" | "TRAINING_DIALOG" | "EXIT" | "UNKNOWN";
export type TrainingStateType = "CLOSED" | "OPEN" | "MINIMIZED";

interface BaseAppState {
    type: AppStateType;
}

interface HomeAppState extends BaseAppState {
    type: "HOME";
}

interface ExitAppState extends BaseAppState {
    type: "EXIT";
    url?: string;
}

interface UnknownAppState extends BaseAppState {
    type: "UNKNOWN";
}

interface TrainingAppState extends BaseAppState {
    type: "TRAINING";
    state: TrainingStateType;
    module: string;
    step: number;
    content: number;
}

interface TrainingDialogAppState extends BaseAppState {
    type: "TRAINING_DIALOG";
    module: string;
    dialog: string;
}

export type AppState =
    | HomeAppState
    | ExitAppState
    | UnknownAppState
    | TrainingAppState
    | TrainingDialogAppState;

export const buildPathFromState = (state: AppState): string => {
    switch (state.type) {
        case "HOME":
            return `/`;
        case "TRAINING_DIALOG":
            return `/tutorial/${state.module}/${state.dialog}`;
        case "TRAINING":
            return `/tutorial/${state.module}/${state.step}/${state.content}`;
        default:
            return "/";
    }
};

export const buildStateFromPath = (match: ReactRouterMatch[]): AppState => {
    log(match);
    return { type: "HOME" };
};
