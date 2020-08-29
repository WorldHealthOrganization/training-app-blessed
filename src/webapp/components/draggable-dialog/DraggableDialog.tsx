import { Button, DialogActions, DialogTitle } from "@material-ui/core";
import { Paper } from "material-ui";
import React from "react";
import Draggable from "react-draggable";

export interface DraggableDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export const DraggableDialog: React.FC<DraggableDialogProps> = ({ open, setOpen }) => {
    const handleClose = () => {
        setOpen(false);
    };

    if (!open) return null;

    return (
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
    );
};
