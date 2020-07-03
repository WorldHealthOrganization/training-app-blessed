//@ts-ignore
import { useConfig } from "@dhis2/app-runtime";
import { LinearProgress } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { SnackbarProvider } from "d2-ui-components";
import _ from "lodash";
//@ts-ignore
import OldMuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import Root from "../../pages/root/RootPage";
import Share from "../share/Share";
import "./App.css";
import muiThemeLegacy from "./themes/dhis2-legacy.theme";
import { muiTheme } from "./themes/dhis2.theme";

type D2 = object;

type AppWindow = Window & {
    $: {
        feedbackDhis2: (
            d2: D2,
            appKey: string,
            feedbackOptions: AppConfig["feedback"]["feedbackOptions"]
        ) => void;
    };
};

function initFeedbackTool(d2: D2, appConfig: AppConfig): void {
    const appKey = _(appConfig).get("appKey");

    if (appConfig && appConfig.feedback) {
        const feedbackOptions = {
            ...appConfig.feedback,
            i18nPath: "feedback-tool/i18n",
        };
        ((window as unknown) as AppWindow).$.feedbackDhis2(d2, appKey, feedbackOptions);
    }
}

const App = () => {
    const { baseUrl } = useConfig();
    const { d2 } = useAppContext();

    const [showShareButton, setShowShareButton] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("app-config.json", {
            credentials: "same-origin",
        })
            .then(res => res.json())
            .then(appConfig => {
                setShowShareButton(_(appConfig).get("appearance.showShareButton") || false);
                initFeedbackTool(d2, appConfig);
                setLoading(false);
            });
    }, [d2]);

    if (loading) {
        return (
            <div style={{ margin: 20 }}>
                <h3>Connecting to {baseUrl}...</h3>
                <LinearProgress />
            </div>
        );
    }

    return (
        <MuiThemeProvider theme={muiTheme}>
            <OldMuiThemeProvider muiTheme={muiThemeLegacy}>
                <SnackbarProvider>
                    <div id="app" className="content">
                        <Root />
                    </div>

                    <Share visible={showShareButton} />
                </SnackbarProvider>
            </OldMuiThemeProvider>
        </MuiThemeProvider>
    );
};

interface AppConfig {
    appKey: string;
    appearance: {
        showShareButton: boolean;
    };
    feedback: {
        token: string[];
        createIssue: boolean;
        sendToDhis2UserGroups: string[];
        issues: {
            repository: string;
            title: string;
            body: string;
        };
        snapshots: {
            repository: string;
            branch: string;
        };
        feedbackOptions: {};
    };
}

export default React.memo(App);
