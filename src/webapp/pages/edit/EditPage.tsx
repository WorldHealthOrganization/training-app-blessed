import React, { useCallback, useState } from "react";
import { useEffect } from "react";
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

    const openSettings = useCallback(() => {
        setAppState({ type: "SETTINGS" });
    }, [setAppState]);

    const saveModule = useCallback(async () => {
        await usecases.modules.update(stateModule);
        await reload();
    }, [stateModule]);

    useEffect(() => {
        if (module) updateStateModule(module);
    }, [module]);

    return (
        <DhisPage>
            <Header title={edit ? i18n.t("Edit module") : i18n.t("Create module")} onBackClick={openSettings} />

            {stateModule ? (
                <Wizard
                    isEdit={edit}
                    onChange={updateStateModule}
                    onCancel={openSettings}
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
