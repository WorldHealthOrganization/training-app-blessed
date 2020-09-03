export type AppStateType =
    | "TRAINING_CLOSED"
    | "TRAINING_OPEN"
    | "TRAINING_MINIMIZED"
    | "TRAINING_DIALOG";

interface BaseAppState {
    type: AppStateType;
}

interface TrainingAppState extends BaseAppState {
    type: "TRAINING_CLOSED" | "TRAINING_OPEN" | "TRAINING_MINIMIZED";
}

interface DialogAppState extends BaseAppState {
    type: "TRAINING_DIALOG";
}

export type AppState = TrainingAppState | DialogAppState;
