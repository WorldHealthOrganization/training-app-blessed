import { useConfig } from "@dhis2/app-runtime";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { LoadingProvider, SnackbarProvider } from "d2-ui-components";
import OldMuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import React from "react";
import { HashRouter } from "react-router-dom";
import i18n from "../../locales";
import { CompositionRoot } from "../CompositionRoot";
import { AppContext } from "../contexts/app-context";
import { AppRoute } from "../router/AppRoute";
import { Router } from "../router/Router";
import muiThemeLegacy from "../themes/dhis2-legacy.theme";
import { muiTheme } from "../themes/dhis2.theme";
import "./App.css";
import { TutorialPage } from "./tutorial/TutorialPage";
import { FinalPage } from "./final/FinalPage";
import { OverviewPage } from "./overview/OverviewPage";
import { SummaryPage } from "./summary/SummaryPage";
import { WelcomePage } from "./welcome/WelcomePage";

export const routes: AppRoute[] = [
    {
        key: "overview",
        name: () => i18n.t("Overview"),
        defaultRoute: true,
        caseSensitive: false,
        path: "/",
        element: <OverviewPage />,
        children: [],
    },
    {
        key: "tutorial",
        name: () => i18n.t("Tutorial"),
        defaultRoute: true,
        caseSensitive: false,
        path: "/tutorial/:key",
        element: <TutorialPage />,
        children: [],
    },
    {
        key: "welcome",
        name: () => i18n.t("Welcome"),
        defaultRoute: true,
        caseSensitive: false,
        path: "/tutorial/:key/welcome",
        element: <WelcomePage />,
        children: [],
    },
    {
        key: "final",
        name: () => i18n.t("Final"),
        defaultRoute: true,
        caseSensitive: false,
        path: "/tutorial/:key/final",
        element: <FinalPage />,
        children: [],
    },
    {
        key: "summary",
        name: () => i18n.t("Summary"),
        defaultRoute: true,
        caseSensitive: false,
        path: "/tutorial/:key/summary",
        element: <SummaryPage />,
        children: [],
    },
];

const App = () => {
    const { baseUrl } = useConfig();
    const compositionRoot = new CompositionRoot();

    return (
        <AppContext.Provider value={{ baseUrl, routes, compositionRoot }}>
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
            </MuiThemeProvider>{" "}
        </AppContext.Provider>
    );
};

export default React.memo(App);
