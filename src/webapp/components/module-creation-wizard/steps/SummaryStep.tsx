import { Button } from "@material-ui/core";
import React, { useCallback } from "react";
import i18n from "../../../../locales";
import { useAppContext } from "../../../contexts/app-context";
import { ModuleCreationWizardStepProps } from "./index";

export const SummaryStep: React.FC<ModuleCreationWizardStepProps> = ({ module, onClose }) => {
    const { usecases } = useAppContext();

    const saveModule = useCallback(async () => {
        if (!module) return;
        await usecases.modules.update(module);
        onClose();
    }, [usecases]);

    return (
        <React.Fragment>
            <Button onClick={saveModule}>{i18n.t("Save")}</Button>
        </React.Fragment>
    );
};
