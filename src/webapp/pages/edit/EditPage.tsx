import { ConfirmationDialog, ConfirmationDialogProps } from "@eyeseetea/d2-ui-components";
import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { defaultTrainingModule, PartialTrainingModule } from "../../../domain/entities/TrainingModule";
import i18n from "../../../locales";
import { ModuleCreationWizard } from "../../components/module-creation-wizard/ModuleCreationWizard";
import { PageHeader } from "../../components/page-header/PageHeader";
import { useAppContext } from "../../contexts/app-context";
import { DhisPage } from "../dhis/DhisPage";

export interface EditPageProps {
    edit: boolean;
}

export const EditPage: React.FC<EditPageProps> = ({ edit }) => {
    const { module, setAppState, usecases, reload } = useAppContext();

    const [stateModule, updateStateModule] = useState<PartialTrainingModule>(module ?? defaultTrainingModule);
    const [dialogProps, updateDialog] = useState<ConfirmationDialogProps | null>(null);
    const [dirty, setDirty] = useState<boolean>(false);

    const openSettings = useCallback(() => {
        setAppState({ type: "SETTINGS" });
    }, [setAppState]);

    const saveModule = useCallback(async () => {
        await usecases.modules.update({ ...stateModule, id: _.kebabCase(stateModule.id) });
        await reload();
    }, [stateModule, usecases, reload]);

    const onChange = useCallback((update: Parameters<typeof updateStateModule>[0]) => {
        updateStateModule(update);
        setDirty(true);
    }, []);

    const onCancel = useCallback(() => {
        if (!dirty) {
            openSettings();
            return;
        }

        updateDialog({
            title: edit ? i18n.t("Cancel module editing?") : i18n.t("Cancel module creation?"),
            description: i18n.t("All your changes will be lost. Are you sure you want to proceed?"),
            saveText: i18n.t("Yes"),
            cancelText: i18n.t("No"),
            onSave: openSettings,
            onCancel: () => updateDialog(null),
        });
    }, [dirty, edit, openSettings]);

    useEffect(() => {
        if (module) updateStateModule(module);
    }, [module]);

    return (
        <DhisPage>
            <Header title={edit ? i18n.t("Edit module") : i18n.t("Create module")} onBackClick={onCancel} />

            {dialogProps && <ConfirmationDialog isOpen={true} maxWidth={"xl"} {...dialogProps} />}

            {stateModule ? (
                <Wizard
                    isEdit={edit}
                    onChange={onChange}
                    onCancel={onCancel}
                    onClose={openSettings}
                    onSave={saveModule}
                    module={stateModule}
                />
            ) : null}
        </DhisPage>
    );
};

const Header = styled(PageHeader)`
    margin-top: 1rem;
`;

const Wizard = styled(ModuleCreationWizard)`
    margin: 1rem;
`;
