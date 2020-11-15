import TextField from "@material-ui/core/TextField";
import { ConfirmationDialog } from "d2-ui-components";
import React from "react";

export const ModuleCreationDialog: React.FC = () => {
    return (
        <ConfirmationDialog
            title={"Add module"}
            isOpen={false}
            maxWidth={"sm"}
            fullWidth={true}
            onCancel={() => {}}
            onSave={() => {}}
        >
            <TextField fullWidth={true} label={"Name"} value={""} onChange={() => {}} />
        </ConfirmationDialog>
    );
};
