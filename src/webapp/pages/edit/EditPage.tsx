import _ from "lodash";
import React, { useCallback } from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { ModuleCreationWizard } from "../../components/module-creation-wizard/ModuleCreationWizard";
import { PageHeader } from "../../components/page-header/PageHeader";
import { useAppContext } from "../../contexts/app-context";
import { DhisPage } from "../dhis/DhisPage";

export interface EditPageProps {
    edit: boolean;
}

export const EditPage: React.FC<EditPageProps> = ({ edit }) => {
    const { modules, setAppState } = useAppContext();

    const openSettings = useCallback(() => {
        setAppState({ type: "SETTINGS" });
    }, [setAppState]);

    return (
        <DhisPage>
            <Header title={i18n.t("Create module")} onBackClick={openSettings} />

            {modules[0] ? (
                <ModuleCreationWizard
                    isEdit={edit}
                    onChange={_.noop}
                    onCancel={openSettings}
                    onClose={openSettings}
                    module={modules[0]}
                />
            ) : null}
        </DhisPage>
    );
};

const Header = styled(PageHeader)`
    margin-top: 1rem;
`;
