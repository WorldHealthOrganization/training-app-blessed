export type AppStateType = "HOME" | "TRAINING" | "TRAINING_DIALOG" | "EXIT";
export type TrainingStateType = "CLOSED" | "OPEN" | "MINIMIZED";

interface BaseAppState {
    type: AppStateType;
    path?: string;
}

interface HomeAppState extends BaseAppState {
    type: "HOME";
}

interface ExitAppState extends BaseAppState {
    type: "EXIT";
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

export type AppState = HomeAppState | TrainingAppState | TrainingDialogAppState | ExitAppState;

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
