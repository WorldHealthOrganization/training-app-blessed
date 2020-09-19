import { WizardStepperProps } from "d2-ui-components";
import _ from "lodash";
import React, { useCallback } from "react";
import styled from "styled-components";
import { arrayFill } from "../../../../utils/array";
import { useAppContext } from "../../../contexts/app-context";
import { Bullet } from "./Bullet";

export const Stepper = ({
    steps,
    currentStepKey,
    markAllCompleted = false,
}: WizardStepperProps & { markAllCompleted?: boolean }) => {
    const { setAppState } = useAppContext();

    const moveStep = useCallback(
        (step: number) => {
            setAppState(appState => {
                if (appState.type !== "TRAINING") return appState;
                return { ...appState, step, content: 1 };
            });
        },
        [setAppState]
    );

    if (steps.length === 0) return null;

    const index = _(steps).findIndex(step => step.key === currentStepKey);
    const currentStepIndex = index >= 0 ? index : 0;
    const currentStep = steps[currentStepIndex];

    const {
        stepIndex = currentStepIndex,
        totalSteps = steps.length,
    } = (currentStep.props as unknown) as any;

    return (
        <ProgressBar>
            {arrayFill(totalSteps).map(index => (
                <Step key={`step-${index}`}>
                    <Bullet
                        stepKey={index + 1}
                        current={index === stepIndex}
                        completed={markAllCompleted || index < stepIndex}
                        last={index === totalSteps - 1}
                        onClick={() => moveStep(index + 1)}
                    />
                </Step>
            ))}
        </ProgressBar>
    );
};

const ProgressBar = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-end;
    width: 90%;
    margin: 0 auto;
    padding: 25px;
`;

const Step = styled.div`
    text-align: center;
    width: 20%;
    position: relative;
`;
