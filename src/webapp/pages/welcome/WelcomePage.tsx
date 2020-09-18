import React, { useCallback } from "react";
import styled from "styled-components";
import DataEntryIcon from "../../assets/data-entry/Icon.png";
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
    const { setAppState } = useAppContext();

    const exitTutorial = useCallback(() => {
        setAppState({ type: "EXIT" });
    }, [setAppState]);

    return (
        <StyledModal>
            <ModalContent>
                <ModalTitle big={true}>Welcome to the tutorial for Data Entry</ModalTitle>
                <Image>
                    <img src={DataEntryIcon} alt="Welcome Illustration" />
                </Image>
                <ModalParagraph>
                    The data entry application is used to enter data that need to be entered for one
                    location on a regular basis such as weekly, monthy etc. Data is registered for a
                    location, time period and a specific dataset.{" "}
                </ModalParagraph>
            </ModalContent>
            <ModalFooter>
                <MainButton color="secondary" onClick={exitTutorial}>
                    Exit Tutorial
                </MainButton>
                <MainButton color="primary">Start Tutorial</MainButton>
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
