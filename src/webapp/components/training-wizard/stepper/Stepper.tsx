import { WizardStepperProps } from "d2-ui-components";
import _ from "lodash";
import React from "react";
import styled from "styled-components";
import { Bullet } from "./Bullet";

export const Stepper = ({ steps, currentStepKey, onStepClicked }: WizardStepperProps) => {
    if (steps.length === 0) return null;

    const index = _(steps).findIndex(step => step.key === currentStepKey);
    const currentStepIndex = index >= 0 ? index : 0;
    const currentStep = steps[currentStepIndex];

    return (
        <ProgressBar>
            {steps.map((step, index) => (
                <Step key={step.key}>
                    <Bullet
                        stepKey={index + 1}
                        current={currentStep === step}
                        completed={index < currentStepIndex}
                        last={index === steps.length}
                        onClick={onStepClicked(step.key)}
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
