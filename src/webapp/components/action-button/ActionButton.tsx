import { Fab, makeStyles } from "@material-ui/core";
import React from "react";
import i18n from "../../../locales";

export interface ActionButtonProps {
    onClick: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ onClick }) => {
    const classes = useStyles();

    return (
        <Fab
            className={classes.fab}
            variant="extended"
            size="large"
            color="primary"
            onClick={onClick}
        >
            {i18n.t("Tutorial")}
        </Fab>
    );
};

const useStyles = makeStyles(theme => ({
    fab: {
        position: "fixed",
        margin: theme.spacing(1),
        bottom: theme.spacing(4),
        right: theme.spacing(8),
    },
}));
