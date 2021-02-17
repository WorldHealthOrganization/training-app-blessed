import { Wizard, WizardStep, WizardStepperProps } from "@eyeseetea/d2-ui-components";
import React, { useCallback, useRef } from "react";
import styled from "styled-components";
import { extractStepFromKey, TrainingModule } from "../../../domain/entities/TrainingModule";
import { Modal } from "../modal/Modal";
import { ModalContent } from "../modal/ModalContent";
import { Navigation } from "./navigation/Navigation";
import { Stepper } from "./stepper/Stepper";

export interface TrainingWizardProps {
    steps: WizardStep[];
    module?: TrainingModule;
    onClose: () => void;
    onGoHome: () => void;
    currentStep: string;
    onChangeStep: (step: number, contents: number) => void;
    minimized: boolean;
    onMinimize: () => void;
    updateProgress: (moduleId: string, progress: number) => Promise<void>;
}

export interface TrainingWizardStepProps {
    title?: string;
    subtitle?: string;
    description?: string;
    content?: string;
    minimized?: boolean;
    stepIndex?: number;
    contentIndex?: number;
    totalSteps?: number;
    totalContents?: number;
}

export const TrainingWizard: React.FC<TrainingWizardProps> = props => {
    const {
        steps,
        module,
        onClose,
        onGoHome,
        currentStep,
        onChangeStep,
        minimized,
        onMinimize,
        updateProgress,
    } = props;
    const lastStep = useRef<string>();

    const onStepChange = useCallback(
        async (stepKey: string) => {
            if (!module || lastStep.current === stepKey) return;

            const currentStep = extractStepFromKey(stepKey);
            if (!currentStep) return;

            const prevStep = extractStepFromKey(lastStep?.current ?? "");
            const isOneStepChange = !!prevStep && Math.abs(currentStep.step - prevStep.step) === 1;
            const shouldUpdateProgress = isOneStepChange && !module.progress.completed;

            if (shouldUpdateProgress) {
                await updateProgress(module.id, currentStep.step - 1);
            }

            lastStep.current = stepKey;
            onChangeStep(currentStep.step, currentStep.content);
        },
        [module, updateProgress]
    );

    const WizardStepper = (props: WizardStepperProps) => <Stepper {...props} onMove={step => onChangeStep(step, 1)} />;

    if (!module || steps.length === 0) return null;

    return (
        <StyledModal
            onClose={onClose}
            onGoHome={onGoHome}
            onMinimize={onMinimize}
            minimized={minimized}
            allowDrag={true}
        >
            <StyledWizard
                steps={steps}
                stepKey={currentStep}
                onStepChange={onStepChange}
                initialStepKey={steps[0]?.key}
                StepperComponent={minimized ? EmptyComponent : WizardStepper}
                NavigationComponent={minimized ? EmptyComponent : Navigation}
            />
        </StyledModal>
    );
};

const StyledWizard = styled(Wizard)`
    height: 100%;

    .MuiPaper-root {
        box-shadow: none;
        background-color: inherit;
        margin: inherit;
        height: 100%;
    }
`;

const StyledModal = styled(Modal)`
    position: fixed;
    margin: 6px;
    bottom: 20px;
    right: 40px;
    height: ${({ minimized }) => (minimized ? "inherit" : "75%")};

    ${ModalContent} {
        padding: 0px 15px;
        max-height: 75%;
    }

    ${StyledWizard} .MuiPaper-root {
        padding: ${({ minimized }) => (minimized ? "35px 0px 20px" : "inherit")};
    }
`;

const EmptyComponent = () => null;
