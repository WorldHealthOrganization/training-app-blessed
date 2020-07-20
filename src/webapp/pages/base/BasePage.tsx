import { useConfig } from "@dhis2/app-runtime";
import { Fab, makeStyles } from "@material-ui/core";
import React from "react";
import i18n from "../../../locales";
import { IFrame } from "../../components/iframe/IFrame";

export const BasePage = () => {
    const { baseUrl } = useConfig();
    const classes = useStyles();
    console.log(baseUrl);

    return (
        <React.Fragment>
            <IFrame className={classes.iframe} src={baseUrl} />
            <Fab className={classes.fab} variant="extended" size="large" color="primary">
                {i18n.t("Tutorial")}
            </Fab>
        </React.Fragment>
    );
};

const useStyles = makeStyles(theme => ({
    iframe: {
        position: "absolute",
    },
    fab: {
        position: "fixed",
        margin: theme.spacing(1),
        bottom: theme.spacing(4),
        right: theme.spacing(8),
    },
}));
