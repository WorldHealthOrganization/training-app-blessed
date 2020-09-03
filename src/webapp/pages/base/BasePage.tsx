import { makeStyles } from "@material-ui/core";
import React, { useCallback, useState } from "react";
import { ActionButton } from "../../components/action-button/ActionButton";
import { IFrame } from "../../components/iframe/IFrame";
import { TrainingWizard } from "../../components/training-wizard/TrainingWizard";
import { useAppContext } from "../../contexts/app-context";

export const BasePage = () => {
    const { baseUrl } = useAppContext();
    const classes = useStyles();

    const [open, setOpen] = useState(false);

    const onClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    return (
        <React.Fragment>
            <IFrame className={classes.iframe} src={baseUrl} />
            {open ? (
                <TrainingWizard onClose={onClose} />
            ) : (
                <ActionButton onClick={() => setOpen(!open)} />
            )}
        </React.Fragment>
    );
};

const useStyles = makeStyles(() => ({
    iframe: {
        position: "absolute",
    },
}));
