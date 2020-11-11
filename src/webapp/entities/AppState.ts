import { ReactRouterMatch } from "../router/AppRoute";

export type TrainingStateType = "CLOSED" | "OPEN" | "MINIMIZED";
export type AppStateType =
    | "HOME"
    | "TRAINING"
    | "TRAINING_DIALOG"
    | "EXIT"
    | "UNKNOWN"
    | "SETTINGS";

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
    dialog: "welcome" | "final" | "summary" | "contents";
}

interface SettingsAppState extends BaseAppState {
    type: "SETTINGS";
}

export type AppState =
    | HomeAppState
    | SettingsAppState
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
        case "SETTINGS":
            return `/settings`;
        default:
            return "/";
    }
};

export const buildStateFromPath = (matches: ReactRouterMatch[]): AppState => {
    for (const match of matches) {
        switch (match.route.path) {
            case "/":
                return { type: "HOME" };
            case "/settings":
                return { type: "SETTINGS" };
            case "/tutorial/:key":
            case "/tutorial/:key/welcome":
                return { type: "TRAINING_DIALOG", dialog: "welcome", module: match.params.key };
            case "/tutorial/:key/contents":
                return { type: "TRAINING_DIALOG", dialog: "contents", module: match.params.key };
            case "/tutorial/:key/summary":
                return { type: "TRAINING_DIALOG", dialog: "summary", module: match.params.key };
            case "/tutorial/:key/final":
                return { type: "TRAINING_DIALOG", dialog: "final", module: match.params.key };
            case "/tutorial/:key/:step/:content":
                return {
                    type: "TRAINING",
                    module: match.params.key,
                    step: parseInt(match.params.step),
                    content: parseInt(match.params.content),
                    state: "OPEN",
                };
        }
    }
    return { type: "HOME" };
};
