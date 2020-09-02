import { useConfig } from "@dhis2/app-runtime";
import { makeStyles } from "@material-ui/core";
import React from "react";
import { ActionButton } from "../../components/action-button/ActionButton";
import { IFrame } from "../../components/iframe/IFrame";
import { TrainingWizard } from "../../components/training-wizard/TrainingWizard";

export const BasePage = () => {
    const { baseUrl } = useConfig();
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <IFrame className={classes.iframe} src={baseUrl} />
            <ActionButton onClick={() => setOpen(!open)} />
            <TrainingWizard open={open} setOpen={setOpen} />
        </React.Fragment>
    );
};

const useStyles = makeStyles(() => ({
    iframe: {
        position: "absolute",
    },
}));
