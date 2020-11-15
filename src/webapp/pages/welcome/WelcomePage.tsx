import React, { useCallback } from "react";
import styled from "styled-components";
import { TrainingModuleWelcome } from "../../../domain/entities/TrainingModule";
import { MainButton } from "../../components/main-button/MainButton";
import { MarkdownViewer } from "../../components/markdown-viewer/MarkdownViewer";
import {
    Modal,
    ModalContent,
    ModalFooter,
    ModalParagraph,
    ModalTitle,
} from "../../components/modal";
import { useAppContext } from "../../contexts/app-context";

export const WelcomePage = () => {
    const { setAppState, module } = useAppContext();

    const startTutorial = useCallback(() => {
        if (!module) return;
        setAppState({ type: "TRAINING_DIALOG", dialog: "contents", module: module.id });
    }, [module, setAppState]);

    const exitTutorial = useCallback(() => {
        setAppState({ type: "HOME" });
    }, [setAppState]);

    const toggleClose = useCallback(() => {
        if (!module) return;
        setAppState({ type: "TRAINING", module: module.id, step: 0, content: 0, state: "CLOSED" });
    }, [module, setAppState]);

    if (!module) return null;

    return (
        <StyledModal onClose={toggleClose}>
            <WelcomePageContent {...module.contents.welcome} />
            <ModalFooter>
                <MainButton color="secondary" onClick={exitTutorial}>
                    Go Back
                </MainButton>
                <MainButton color="primary" onClick={startTutorial}>
                    Start Tutorial
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

const Paragraph = styled(MarkdownViewer)`
    p {
        text-align: center;
    }
`;

export const WelcomePageContent: React.FC<TrainingModuleWelcome> = ({ title, description }) => {
    return (
        <ModalContent>
            <ModalTitle big={true}>{title}</ModalTitle>
            <ModalParagraph>
                <Paragraph source={description} />
            </ModalParagraph>
        </ModalContent>
    );
};
