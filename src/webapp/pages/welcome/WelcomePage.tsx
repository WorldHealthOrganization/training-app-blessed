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
        setAppState({
            type: "TRAINING",
            state: "CLOSED",
            module: module.key,
            step: 1,
            content: 1,
        });
    }, [module, setAppState]);

    const exitTutorial = useCallback(() => {
        setAppState({ type: "EXIT" });
    }, [setAppState]);

    if (!module) return null;
    const { title, description, icon } = module.details;

    return (
        <StyledModal>
            <ModalContent>
                <ModalTitle big={true}>{title}</ModalTitle>
                <Image>
                    <img src={icon} alt="Welcome Illustration" />
                </Image>
                <ModalParagraph>{description}</ModalParagraph>
            </ModalContent>
            <ModalFooter>
                <MainButton color="secondary" onClick={exitTutorial}>
                    Exit Tutorial
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
