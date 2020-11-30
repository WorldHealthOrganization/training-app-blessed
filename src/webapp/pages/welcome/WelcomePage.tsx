import React, { useCallback } from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { MainButton } from "../../components/main-button/MainButton";
import { MarkdownViewer } from "../../components/markdown-viewer/MarkdownViewer";
import { Modal, ModalContent, ModalFooter } from "../../components/modal";
import { useAppContext } from "../../contexts/app-context";

export const WelcomePage = () => {
    const { setAppState, module, translate } = useAppContext();

    const startTutorial = useCallback(() => {
        if (!module) return;
        setAppState({ type: "TRAINING_DIALOG", dialog: "contents", module: module.id });
    }, [module, setAppState]);

    const exitTutorial = useCallback(() => {
        setAppState(appState => ({ ...appState, exit: true }));
    }, [setAppState]);

    const minimize = useCallback(() => {
        setAppState(appState => ({ ...appState, minimized: true }));
    }, [setAppState]);

    const goHome = useCallback(() => {
        setAppState({ type: "HOME" });
    }, [setAppState]);

    if (!module) return null;

    return (
        <StyledModal
            onMinimize={minimize}
            onClose={exitTutorial}
            onGoHome={goHome}
            centerChildren={true}
        >
            <WelcomePageContent welcome={translate(module.contents.welcome)} />
            <ModalFooter>
                <MainButton color="secondary" onClick={exitTutorial}>
                    {i18n.t("Exit Tutorial")}
                </MainButton>
                <MainButton color="primary" onClick={startTutorial}>
                    {i18n.t("Start Tutorial")}
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

export const WelcomePageContent: React.FC<{ welcome: string }> = ({ welcome }) => {
    return (
        <ModalContent>
            <MarkdownViewer source={welcome} center={true} />
        </ModalContent>
    );
};
