export type AppStateType = "MAIN_DIALOG" | "TRAINING" | "TRAINING_DIALOG" | "UNKNOWN";
export type TrainingStateType = "CLOSED" | "OPEN" | "MINIMIZED";

interface BaseAppState {
    type: AppStateType;
    path?: string;
}

interface MainDialogAppState extends BaseAppState {
    type: "MAIN_DIALOG";
    dialog: string;
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

interface UnknownAppState extends BaseAppState {
    type: "UNKNOWN";
}

export type AppState =
    | MainDialogAppState
    | TrainingAppState
    | TrainingDialogAppState
    | UnknownAppState;

export const buildPathFromState = (state: AppState): string => {
    switch (state.type) {
        case "MAIN_DIALOG":
            return `/${state.dialog}`;
        case "TRAINING_DIALOG":
            return `/tutorial/${state.module}/${state.dialog}`;
        case "TRAINING":
            return `/tutorial/${state.module}/${state.step}/${state.content}`;
        default:
            return "/";
    }
};
