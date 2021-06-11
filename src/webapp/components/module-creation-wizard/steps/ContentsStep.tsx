import React, { useCallback, useMemo, useState } from "react";
import {
    addPage,
    addStep,
    removePage,
    removeStep,
    updateOrder,
    updateTranslation,
} from "../../../../domain/helpers/TrainingModuleHelpers";
import i18n from "../../../../locales";
import { ComponentParameter } from "../../../../types/utils";
import { useAppContext } from "../../../contexts/app-context";
import { InputDialog, InputDialogProps } from "../../input-dialog/InputDialog";
import { buildListSteps, ModuleListTable } from "../../module-list-table/ModuleListTable";
import { ModuleCreationWizardStepProps } from "./index";

export const ContentsStep: React.FC<ModuleCreationWizardStepProps> = ({ module, onChange }) => {
    const { usecases } = useAppContext();

    const [dialogProps, updateDialog] = useState<InputDialogProps | null>(null);

    const uploadFile = useCallback(({ data }) => usecases.instance.uploadFile(data), [usecases]);

    const openAddStep = useCallback(() => {
        updateDialog({
            title: i18n.t("Add new step"),
            inputLabel: i18n.t("Title *"),
            onCancel: () => {
                updateDialog(null);
            },
            onSave: title => {
                updateDialog(null);
                onChange(module => addStep(module, title));
            },
        });
    }, [onChange]);

    const tableActions: ComponentParameter<typeof ModuleListTable, "tableActions"> = useMemo(
        () => ({
            uploadFile,
            editContents: async ({ text, value }) => onChange(module => updateTranslation(module, text.key, value)),
            swap: async ({ type, from, to }) => {
                if (type === "module") return;
                onChange(module => updateOrder(module, from, to));
            },
            addPage: async ({ step, value }) => onChange(module => addPage(module, step, value)),
            addStep: async ({ title }) => onChange(module => addStep(module, title)),
            deleteStep: async ({ step }) => onChange(module => removeStep(module, step)),
            deletePage: async ({ step, page }) => onChange(module => removePage(module, step, page)),
        }),
        [onChange, uploadFile]
    );

    return (
        <React.Fragment>
            {dialogProps && <InputDialog isOpen={true} fullWidth={true} maxWidth={"md"} {...dialogProps} />}

            <ModuleListTable
                rows={buildListSteps(module, module.contents.steps)}
                tableActions={tableActions}
                onActionButtonClick={openAddStep}
            />
        </React.Fragment>
    );
};
