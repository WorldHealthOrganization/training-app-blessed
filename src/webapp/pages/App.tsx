import { MuiThemeProvider } from "@material-ui/core/styles";
import { LoadingProvider, SnackbarProvider } from "d2-ui-components";
import OldMuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import React from "react";
import muiThemeLegacy from "../themes/dhis2-legacy.theme";
import { muiTheme } from "../themes/dhis2.theme";
import "./App.css";
import { Router } from "./router/Router";

const App = () => {
    return (
        <MuiThemeProvider theme={muiTheme}>
            <OldMuiThemeProvider muiTheme={muiThemeLegacy}>
                <SnackbarProvider>
                    <LoadingProvider>
                        <div id="app" className="content">
                            <Router />
                        </div>
                    </LoadingProvider>
                </SnackbarProvider>
            </OldMuiThemeProvider>
        </MuiThemeProvider>
    );
};

export default React.memo(App);
