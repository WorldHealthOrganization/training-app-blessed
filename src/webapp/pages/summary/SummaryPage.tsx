import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { TrainingModule } from "../../../domain/entities/TrainingModule";
import { MainButton } from "../../components/main-button/MainButton";
import { Modal, ModalContent, ModalFooter, ModalTitle } from "../../components/modal";
import { Bullet } from "../../components/training-wizard/stepper/Bullet";
import { useAppContext } from "../../contexts/app-context";
import { Label, Line, Step } from "./SummaryStep";

export const SummaryPage = () => {
    const { usecases } = useAppContext();

    const [module, setModule] = useState<TrainingModule>();

    useEffect(() => {
        usecases.getModule().then(setModule);
    }, [usecases]);

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
