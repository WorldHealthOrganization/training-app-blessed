import React from "react";
import styled from "styled-components";
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

export const FinalPage = () => {
    return (
        <StyledModal>
            <ModalContent bigger={true}>
                <ModalTitle big={true}>Well done!</ModalTitle>
                <ModalParagraph>You’ve completed the data entry tutorial!</ModalParagraph>
                <Stepper steps={[]} lastClickableStepIndex={-1} markAllCompleted={true} />
                <ModalFooter>
                    <MainButton>Next</MainButton>
                </ModalFooter>
            </ModalContent>
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

    ${ModalContent} {
        position: relative;
        top: 25%;
    }

    ${ModalParagraph} {
        font-size: 25px;
        line-height: 32px;
        font-weight: 300;
        margin: 25px 0px 15px 0px;
    }

    ${ModalFooter} {
        margin-top: 20px;
    }
`;
