import React, { useCallback } from "react";
import styled from "styled-components";
import { MainButton } from "../../components/main-button/MainButton";
import { Modal, ModalContent, ModalFooter, ModalTitle } from "../../components/modal";
import { Bullet } from "../../components/training-wizard/stepper/Bullet";
import { useAppContext } from "../../contexts/app-context";
import { Label, Line, Step } from "./SummaryStep";

export const SummaryPage: React.FC<{ completed?: boolean }> = ({ completed }) => {
    const { module, setAppState } = useAppContext();

    const startTutorial = useCallback(() => {
        if (!module) return;
        setAppState({
            type: "TRAINING",
            state: "OPEN",
            module: module.key,
            step: 1,
            content: 1,
        });
    }, [setAppState, module]);

    const endTutorial = useCallback(() => {
        if (!module) return;
        setAppState({ type: "HOME" });
    }, [setAppState, module]);

    const minimize = useCallback(() => {
        if (!module) return;
        setAppState({ type: "TRAINING", module: module.key, step: 0, content: 0, state: "CLOSED" });
    }, [module, setAppState]);

    const title = completed
        ? "What did you learn in this tutorial?"
        : "What will this tutorial cover?";

    const action = completed ? endTutorial : startTutorial;

    return (
        <StyledModal completed={completed} onClose={completed ? endTutorial : minimize}>
            <ContentWrapper>
                <ModalTitle>{title}</ModalTitle>
                <ModalContent bigger={true}>
                    {module?.contents.steps.map(({ title }, idx) => {
                        const half = module.contents.steps.length / 2;
                        const column = idx < half ? "left" : "right";
                        const row = idx % half;
                        const last =
                            idx + 1 === Math.round(half) ||
                            idx === module.contents.steps.length - 1;

                        return (
                            <Step key={`step-${idx}`} column={column} row={row} last={last}>
                                <Bullet stepKey={idx + 1} />
                                <Line />
                                <Label>{title.text}</Label>
                            </Step>
                        );
                    })}
                </ModalContent>
                <ModalFooter>
                    <MainButton onClick={action}>Next</MainButton>
                </ModalFooter>
            </ContentWrapper>
        </StyledModal>
    );
};

const StyledModal = styled(Modal)<{ completed?: boolean }>`
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

    ${({ completed }) =>
        !completed &&
        `
        ${Line} {
            border-left: 2px solid white;
        }

        ${Bullet} {
            color: white;
            background-color: transparent;
            border: 2px solid white;
        }
    `}
`;

const ContentWrapper = styled.div`
    padding: 15px;
`;
