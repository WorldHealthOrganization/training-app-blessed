import { useConfig } from "@dhis2/app-runtime";
import React, { useCallback } from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { MainButton } from "../../components/main-button/MainButton";
import { MarkdownViewer } from "../../components/markdown-viewer/MarkdownViewer";
import { Modal, ModalContent, ModalFooter } from "../../components/modal";
import { useAppContext } from "../../contexts/app-context";

export const ExitPage = () => {
    const { baseUrl } = useConfig();
    const { setAppState, module } = useAppContext();

    const continueTutorial = useCallback(() => {
        setAppState(appState => ({ ...appState, exit: false }));
    }, [setAppState]);

    const exitTutorial = useCallback(() => {
        window.location.href = `${baseUrl}${module?.dhisLaunchUrl ?? ""}`;
    }, [baseUrl, module]);

    const goHome = useCallback(() => {
        setAppState({ type: "HOME" });
    }, [setAppState]);

    return (
        <StyledModal onGoHome={goHome} centerChildren={true}>
            <ExitPageContent />
            <ModalFooter>
                <MainButton color="primary" onClick={continueTutorial}>
                    {i18n.t("Continue Tutorial")}
                </MainButton>
                <MainButton color="secondary" onClick={exitTutorial}>
                    {i18n.t("Exit Tutorial")}
                </MainButton>
            </ModalFooter>
        </StyledModal>
    );
};

const StyledModal = styled(Modal)`
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`;

export const ExitPageContent: React.FC = () => {
    const title = i18n.t("Are you sure you want to exit?");
    const source = [
        `# ${title}`,
        i18n.t(
            "If you are sure you want to exit, select 'Exit tutorial'. You can relaunch the training tutorial again at any time from the applications menu."
        ),
        i18n.t(
            "If you would like to continue with training, select 'Continue tutorial' below or if you would like to select a different tutorial, click on the 'Home' button."
        ),
    ].join("\n\n");

    return (
        <ModalContent>
            <MarkdownViewer source={source} center={true} />
        </ModalContent>
    );
};
