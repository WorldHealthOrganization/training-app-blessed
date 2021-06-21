import { ReactRouterMatch } from "../router/AppRoute";

export type TrainingStateType = "OPEN" | "MINIMIZED";
export type AppStateType =
    | "HOME"
    | "TRAINING"
    | "TRAINING_DIALOG"
    | "UNKNOWN"
    | "SETTINGS"
    | "ABOUT"
    | "EDIT_MODULE"
    | "CREATE_MODULE";

interface BaseAppState {
    type: AppStateType;
    exit?: boolean;
    minimized?: boolean;
}

interface UnknownAppState extends BaseAppState {
    type: "UNKNOWN";
}

interface HomeAppState extends BaseAppState {
    type: "HOME";
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

interface AboutAppState extends BaseAppState {
    type: "ABOUT";
}

interface EditAppState extends BaseAppState {
    type: "EDIT_MODULE";
    module: string;
}

interface CreateAppState extends BaseAppState {
    type: "CREATE_MODULE";
}

export type AppState =
    | UnknownAppState
    | HomeAppState
    | TrainingAppState
    | TrainingDialogAppState
    | SettingsAppState
    | AboutAppState
    | EditAppState
    | CreateAppState;

export const buildPathFromState = (state: AppState): string => {
    switch (state.type) {
        case "HOME":
            return `/`;
        case "TRAINING":
            return `/tutorial/${state.module}/${state.step}/${state.content}`;
        case "TRAINING_DIALOG":
            return `/tutorial/${state.module}/${state.dialog}`;
        case "SETTINGS":
            return `/settings`;
        case "ABOUT":
            return `/about`;
        case "EDIT_MODULE":
            return `/edit/${state.module}`;
        case "CREATE_MODULE":
            return `/create`;
        default:
            return "/";
    }
};

export const buildStateFromPath = (matches: ReactRouterMatch[]): AppState => {
    for (const match of matches) {
        switch (match.route.path) {
            case "/":
                return { type: "HOME" };
            case "/tutorial/:key":
            case "/tutorial/:key/welcome":
                return { type: "TRAINING_DIALOG", dialog: "welcome", module: match.params.key ?? "" };
            case "/tutorial/:key/contents":
                return { type: "TRAINING_DIALOG", dialog: "contents", module: match.params.key ?? "" };
            case "/tutorial/:key/summary":
                return { type: "TRAINING_DIALOG", dialog: "summary", module: match.params.key ?? "" };
            case "/tutorial/:key/final":
                return { type: "TRAINING_DIALOG", dialog: "final", module: match.params.key ?? "" };
            case "/tutorial/:key/:step/:content":
                return {
                    type: "TRAINING",
                    module: match.params.key ?? "",
                    step: parseInt(match.params.step ?? ""),
                    content: parseInt(match.params.content ?? ""),
                    state: "OPEN",
                };
            case "/settings":
                return { type: "SETTINGS" };
            case "/about":
                return { type: "ABOUT" };
            case "/edit/:module":
                return { type: "EDIT_MODULE", module: match.params.module ?? "" };
            case "/create":
                return { type: "CREATE_MODULE" };
        }
    }
    return { type: "HOME" };
};
