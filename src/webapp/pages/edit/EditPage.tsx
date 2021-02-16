import React, { useCallback } from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { PageHeader } from "../../components/page-header/PageHeader";
import { useAppContext } from "../../contexts/app-context";
import { DhisPage } from "../dhis/DhisPage";

export interface EditPageProps {
    edit: boolean;
}

export const EditPage: React.FC<EditPageProps> = () => {
    const { setAppState } = useAppContext();

    const openSettings = useCallback(() => {
        setAppState({ type: "SETTINGS" });
    }, [setAppState]);

    return (
        <DhisPage>
            <Header title={i18n.t("Create module")} onBackClick={openSettings} />
        </DhisPage>
    );
};

const Header = styled(PageHeader)`
    margin-top: 1rem;
`;
