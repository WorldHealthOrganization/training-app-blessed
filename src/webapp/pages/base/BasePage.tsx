import { useConfig } from "@dhis2/app-runtime";
import { Button, DialogActions, DialogTitle, Fab, makeStyles, Paper } from "@material-ui/core";
import React from "react";
import Draggable from "react-draggable";
import i18n from "../../../locales";
import { IFrame } from "../../components/iframe/IFrame";

export const BasePage = () => {
    const { baseUrl } = useConfig();
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <IFrame className={classes.iframe} src={baseUrl} />
            <Fab
                className={classes.fab}
                variant="extended"
                size="large"
                color="primary"
                onClick={() => setOpen(!open)}
            >
                {i18n.t("Tutorial")}
            </Fab>
            <DraggableDialog open={open} setOpen={setOpen} />
        </React.Fragment>
    );
};

export function DraggableDialog({ open, setOpen }: any) {
    const handleClose = () => {
        setOpen(false);
    };

    return open ? (
        <Draggable handle="#draggable-dialog-title">
            <Paper style={{ width: 300 }}>
                <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
                    Tutorial
                </DialogTitle>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Paper>
        </Draggable>
    ) : null;
}

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
