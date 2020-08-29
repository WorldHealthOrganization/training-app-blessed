import { useConfig } from "@dhis2/app-runtime";
import { makeStyles } from "@material-ui/core";
import React from "react";
import { ActionButton } from "../../components/action-button/ActionButton";
import { DraggableDialog } from "../../components/draggable-dialog/DraggableDialog";
import { IFrame } from "../../components/iframe/IFrame";

export const BasePage = () => {
    const { baseUrl } = useConfig();
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <IFrame className={classes.iframe} src={baseUrl} />
            <ActionButton onClick={() => setOpen(!open)} />
            <DraggableDialog open={open} setOpen={setOpen} />
        </React.Fragment>
    );
};

const useStyles = makeStyles(() => ({
    iframe: {
        position: "absolute",
    },
}));
