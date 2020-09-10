import React from "react";
import styled from "styled-components";
import { MainButton } from "../../components/main-button/MainButton";
import { Modal, ModalContent, ModalFooter, ModalTitle } from "../../components/modal";
import { Bullet } from "../../components/training-wizard/stepper/Bullet";
import { steps } from "../../components/training-wizard/TrainingWizard";
import { Label, Line, Step } from "./SummaryStep";

const values = [
    ...steps,
    ...steps,
    ...steps,
    ...steps,
    ...steps,
    ...steps,
    ...steps,
    ...steps,
    ...steps,
];

export const SummaryPage = () => {
    return (
        <StyledModal>
            <ModalTitle>What did you learn in this tutorial?</ModalTitle>
            <ModalContent bigger={true}>
                {values.map(({ label }, idx) => {
                    const half = values.length / 2;
                    const column = idx < half ? "left" : "right";
                    const row = idx % half;
                    const last = idx + 1 === Math.round(half) || idx === values.length - 1;

                    return (
                        <Step key={`step-${idx}`} column={column} row={row} last={last}>
                            <Bullet stepKey={idx + 1} />
                            <Line />
                            <Label>{label}</Label>
                        </Step>
                    );
                })}
            </ModalContent>
            <ModalFooter>
                <MainButton>Next</MainButton>
            </ModalFooter>
        </StyledModal>
    );
};

const StyledModal = styled(Modal)`
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    ${ModalContent} {
        margin: 25px;
        max-height: 400px;

        display: grid;
        grid-template-columns: repeat(2, 1fr);
    }
`;
