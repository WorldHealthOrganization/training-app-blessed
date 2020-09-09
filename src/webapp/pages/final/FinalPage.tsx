import React from "react";
import styled from "styled-components";
import DataEntryIcon from "../../assets/data-entry/Icon.png";
import Decoration from "../../assets/Decoration.png";
import { MainButton } from "../../components/main-button/MainButton";
import {
    Modal,
    ModalContent,
    ModalFooter,
    ModalParagraph,
    ModalTitle,
} from "../../components/modal";
import { Stepper } from "../../components/training-wizard/stepper/Stepper";
import { steps } from "../../components/training-wizard/TrainingWizard";

export const FinalPage = () => {
    return true ? (
        <StyledModal>
            <ModalContent>
                <span className="modalbigTitle spaced">Well done!</span>
                <span className="modalSmallTitle">You’ve completed the data entry tutorial!</span>
            </ModalContent>
            <Stepper steps={steps} lastClickableStepIndex={-1} markAllCompleted={true} />
            <ModalFooter>
                <MainButton>Next</MainButton>
            </ModalFooter>
        </StyledModal>
    ) : (
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
                <MainButton color="secondary">Exit Tutorial</MainButton>
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

    background-image: url(${Decoration});
    background-position: center; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    height: 600px;
`;

const Image = styled.span`
    display: block;
    margin: 18px 0px;
`;
