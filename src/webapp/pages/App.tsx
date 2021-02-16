import { useConfig } from "@dhis2/app-runtime";
import { LoadingProvider, SnackbarProvider } from "@eyeseetea/d2-ui-components";
import { MuiThemeProvider, StylesProvider } from "@material-ui/core/styles";
import OldMuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import React from "react";
import { HashRouter } from "react-router-dom";
import i18n from "../../locales";
import { CompositionRoot } from "../CompositionRoot";
import { AppContextProvider } from "../contexts/app-context";
import { AppRoute } from "../router/AppRoute";
import { Router } from "../router/Router";
import muiThemeLegacy from "../themes/dhis2-legacy.theme";
import { muiTheme } from "../themes/dhis2.theme";
import "./App.css";
import { EditPage } from "./edit/EditPage";
import { ExitPage } from "./exit/ExitPage";
import { FinalPage } from "./final/FinalPage";
import { HomePage } from "./home/HomePage";
import { SettingsPage } from "./settings/SettingsPage";
import { SummaryPage } from "./summary/SummaryPage";
import { TutorialPage } from "./tutorial/TutorialPage";
import { WelcomePage } from "./welcome/WelcomePage";

export const routes: AppRoute[] = [
    {
        key: "home",
        name: () => i18n.t("Home"),
        defaultRoute: true,
        paths: ["/"],
        element: <HomePage />,
        backdrop: true,
        iframe: true,
    },
    {
        key: "welcome",
        name: () => i18n.t("Welcome"),
        paths: ["/tutorial/:key", "/tutorial/:key/welcome"],
        element: <WelcomePage />,
        backdrop: true,
        iframe: true,
    },
    {
        key: "tutorial",
        name: () => i18n.t("Tutorial"),
        paths: ["/tutorial/:key/:step/:content"],
        element: <TutorialPage />,
        iframe: true,
    },
    {
        key: "contents",
        name: () => i18n.t("Contents"),
        paths: ["/tutorial/:key/contents"],
        element: <SummaryPage completed={false} />,
        backdrop: true,
        iframe: true,
    },
    {
        key: "final",
        name: () => i18n.t("Final"),
        paths: ["/tutorial/:key/final"],
        element: <FinalPage />,
        backdrop: true,
        iframe: true,
    },
    {
        key: "summary",
        name: () => i18n.t("Summary"),
        paths: ["/tutorial/:key/summary"],
        element: <SummaryPage completed={true} />,
        backdrop: true,
        iframe: true,
    },
    {
        key: "exit",
        name: () => i18n.t("Exit"),
        paths: ["/exit"],
        element: <ExitPage />,
    },
    {
        key: "settings",
        name: () => i18n.t("Settings"),
        paths: ["/settings"],
        element: <SettingsPage />,
    },
    {
        key: "edit",
        name: () => i18n.t("Edit"),
        paths: ["/edit/:module"],
        element: <EditPage edit={true} />,
    },
    {
        key: "create",
        name: () => i18n.t("Create"),
        paths: ["/create"],
        element: <EditPage edit={false} />,
    },
];

const App: React.FC<{ locale: string }> = ({ locale }) => {
    const { baseUrl } = useConfig();
    const compositionRoot = new CompositionRoot(baseUrl);

    return (
        <AppContextProvider routes={routes} compositionRoot={compositionRoot} locale={locale}>
            <StylesProvider injectFirst>
                <MuiThemeProvider theme={muiTheme}>
                    <OldMuiThemeProvider muiTheme={muiThemeLegacy}>
                        <SnackbarProvider>
                            <LoadingProvider>
                                <div id="app" className="content">
                                    <HashRouter>
                                        <Router />
                                    </HashRouter>
                                </div>
                            </LoadingProvider>
                        </SnackbarProvider>
                    </OldMuiThemeProvider>
                </MuiThemeProvider>
            </StylesProvider>
        </AppContextProvider>
    );
};

export default React.memo(App);
