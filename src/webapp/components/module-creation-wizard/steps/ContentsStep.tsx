import React, { useCallback, useMemo, useState } from "react";
import { updateOrder, updateTranslation } from "../../../../domain/entities/TrainingModule";
import i18n from "../../../../locales";
import { ComponentParameter } from "../../../../types/utils";
import { useAppContext } from "../../../contexts/app-context";
import { InputDialog, InputDialogProps } from "../../input-dialog/InputDialog";
import { buildListSteps, ModuleListTable } from "../../module-list-table/ModuleListTable";
import { ModuleCreationWizardStepProps } from "./index";

export const ContentsStep: React.FC<ModuleCreationWizardStepProps> = ({ module, onChange }) => {
    const { usecases } = useAppContext();

    const [dialogProps, updateDialog] = useState<InputDialogProps | null>(null);

    const tableActions: ComponentParameter<typeof ModuleListTable, "tableActions"> = useMemo(
        () => ({
            uploadFile: ({ data }) => usecases.instance.uploadFile(data),
            editContents: async ({ text, value }) => onChange(module => updateTranslation(module, text.key, value)),
            swap: async ({ type, from, to }) => {
                if (type === "module") return;
                onChange(module => updateOrder(module, from, to));
            },
        }),
        [usecases, onChange]
    );

    const addStep = useCallback(() => {
        updateDialog({
            title: i18n.t("Add new step"),
            inputLabel: i18n.t("Title *"),
            onCancel: () => {
                updateDialog(null);
            },
            onSave: stepName => {
                updateDialog(null);
                onChange(module => ({
                    ...module,
                    contents: {
                        ...module.contents,
                        steps: [
                            ...module.contents.steps,
                            {
                                id: `${module.id}-step-${module.contents.steps.length}`,
                                title: {
                                    key: `step-${module.contents.steps.length + 1}-title`,
                                    referenceValue: stepName,
                                    translations: {},
                                },
                                subtitle: undefined,
                                pages: [],
                            },
                        ],
                    },
                }));
            },
        });
    }, [onChange]);

    return (
        <React.Fragment>
            {dialogProps && <InputDialog isOpen={true} maxWidth={"xl"} {...dialogProps} />}

            <ModuleListTable
                rows={buildListSteps(module, module.contents.steps)}
                tableActions={tableActions}
                onActionButtonClick={addStep}
            />
        </React.Fragment>
    );
};
