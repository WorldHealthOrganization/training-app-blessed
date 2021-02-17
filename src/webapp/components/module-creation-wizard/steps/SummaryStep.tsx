import { Button } from "@material-ui/core";
import React, { useCallback } from "react";
import i18n from "../../../../locales";
import { ModuleCreationWizardStepProps } from "./index";

export const SummaryStep: React.FC<ModuleCreationWizardStepProps> = ({ onClose, onSave }) => {
    const saveModule = useCallback(async () => {
        await onSave();
        onClose();
    }, []);

    return (
        <React.Fragment>
            <Button onClick={saveModule}>{i18n.t("Save")}</Button>
        </React.Fragment>
    );
};
