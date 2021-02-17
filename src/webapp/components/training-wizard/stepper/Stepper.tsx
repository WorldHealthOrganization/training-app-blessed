import { WizardStep, WizardStepperProps } from "@eyeseetea/d2-ui-components";
import _ from "lodash";
import React from "react";
import styled from "styled-components";
import { arrayFill } from "../../../../utils/array";
import { TrainingWizardStepProps } from "../TrainingWizard";
import { Bullet } from "./Bullet";

export const Stepper: React.FC<StepperProps> = ({
    steps,
    currentStepKey,
    markAllCompleted = false,
    lastClickableStepIndex = -1,
    onMove = _.noop,
}) => {
    if (steps.length === 0) return null;

    const index = _(steps).findIndex(step => step.key === currentStepKey);
    const currentStepIndex = index >= 0 ? index : 0;

    const { props } = steps[currentStepIndex] ?? {};
    const { stepIndex = currentStepIndex, totalSteps = steps.length } = props ?? {};

    return (
        <ProgressBar>
            {arrayFill(totalSteps).map(index => (
                <Step key={`step-${index}`}>
                    <Bullet
                        stepKey={index + 1}
                        current={index === stepIndex}
                        completed={markAllCompleted || index < stepIndex}
                        last={index === totalSteps - 1}
                        onClick={lastClickableStepIndex !== -1 ? () => onMove(index + 1, 1) : undefined}
                    />
                </Step>
            ))}
        </ProgressBar>
    );
};

export interface StepperProps extends WizardStepperProps {
    steps: Array<WizardStep & { props?: TrainingWizardStepProps }>;
    markAllCompleted?: boolean;
    onMove: (step: number, content: number) => void;
}

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
