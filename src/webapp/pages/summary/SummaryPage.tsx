import React, { useCallback } from "react";
import styled from "styled-components";
import { MainButton } from "../../components/main-button/MainButton";
import { Modal, ModalContent, ModalFooter, ModalTitle } from "../../components/modal";
import { Bullet } from "../../components/training-wizard/stepper/Bullet";
import { useAppContext } from "../../contexts/app-context";
import { Label, Line, Step } from "./SummaryStep";

export const SummaryPage = () => {
    const { module, setAppState } = useAppContext();

    const startTutorial = useCallback(() => {
        if (!module) return;
        setAppState({
            type: "TRAINING",
            state: "CLOSED",
            module: module.key,
            step: 1,
            content: 1,
        });
    }, [setAppState, module]);

    return (
        <StyledModal>
            <ModalTitle>What did you learn in this tutorial?</ModalTitle>
            <ModalContent bigger={true}>
                {module?.steps.map(({ title }, idx) => {
                    const half = module.steps.length / 2;
                    const column = idx < half ? "left" : "right";
                    const row = idx % half;
                    const last = idx + 1 === Math.round(half) || idx === module.steps.length - 1;

                    return (
                        <Step key={`step-${idx}`} column={column} row={row} last={last}>
                            <Bullet stepKey={idx + 1} />
                            <Line />
                            <Label>{title}</Label>
                        </Step>
                    );
                })}
            </ModalContent>
            <ModalFooter>
                <MainButton onClick={startTutorial}>Next</MainButton>
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
