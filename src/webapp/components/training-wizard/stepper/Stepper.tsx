import { WizardStepperProps } from "d2-ui-components";
import _ from "lodash";
import React from "react";
import styled from "styled-components";
import { arrayFill } from "../../../../utils/array";
import { Bullet } from "./Bullet";

export const Stepper = ({
    steps,
    currentStepKey,
    markAllCompleted = false,
}: WizardStepperProps & { markAllCompleted?: boolean }) => {
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
