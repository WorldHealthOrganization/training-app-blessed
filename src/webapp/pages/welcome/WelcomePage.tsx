import React, { useCallback } from "react";
import styled from "styled-components";
import { MainButton } from "../../components/main-button/MainButton";
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
        setAppState({ type: "TRAINING_DIALOG", dialog: "contents", module: module.key });
    }, [module, setAppState]);

    const exitTutorial = useCallback(() => {
        setAppState({ type: "HOME" });
    }, [setAppState]);

    const toggleClose = useCallback(() => {
        if (!module) return;
        setAppState({ type: "TRAINING", module: module.key, step: 0, content: 0, state: "CLOSED" });
    }, [module, setAppState]);

    if (!module) return null;

    // TODO: Translate
    const { title, description, icon } = module.contents.welcome;

    return (
        <StyledModal onClose={toggleClose}>
            <ModalContent>
                <ModalTitle big={true}>{title}</ModalTitle>
                <Image>
                    <img src={icon} alt="Welcome Illustration" />
                </Image>
                <ModalParagraph>{description}</ModalParagraph>
            </ModalContent>
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

const Image = styled.span`
    display: block;
    margin: 18px 0px;
`;
