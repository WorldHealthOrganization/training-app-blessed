export type AppStateType =
    | "MAIN_DIALOG"
    | "TRAINING_CLOSED"
    | "TRAINING_OPEN"
    | "TRAINING_MINIMIZED"
    | "TRAINING_DIALOG"
    | "UNKNOWN";

interface BaseAppState {
    type: AppStateType;
}

interface MainDialogAppState extends BaseAppState {
    type: "MAIN_DIALOG";
    dialog: string;
}

interface TrainingAppState extends BaseAppState {
    type: "TRAINING_CLOSED" | "TRAINING_OPEN" | "TRAINING_MINIMIZED";
}

interface TrainingDialogAppState extends BaseAppState {
    type: "TRAINING_DIALOG";
    dialog: string;
}

interface UnknownAppState extends BaseAppState {
    type: "UNKNOWN"
}

export type AppState = MainDialogAppState | TrainingAppState | TrainingDialogAppState | UnknownAppState;

export const buildPathFromState = (state: AppState): string => {
    switch (state.type) {
        case "MAIN_DIALOG":
            return `/${state.dialog}`;
        default:
            return "/";
    }
};
