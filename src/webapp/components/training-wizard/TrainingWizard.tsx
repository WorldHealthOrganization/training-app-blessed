import { Wizard, WizardStep } from "d2-ui-components";
import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { TrainingModule, TrainingModuleContent } from "../../../domain/entities/TrainingModule";
import { useAppContext } from "../../contexts/app-context";
import { Modal } from "../modal/Modal";
import { ModalContent } from "../modal/ModalContent";
import { Navigation } from "./navigation/Navigation";
import { Stepper } from "./stepper/Stepper";
import { MarkdownContentStep } from "./steps/MarkdownContentStep";

export interface TrainingWizardProps {
    onClose: () => void;
}

export interface TrainingWizardStepProps {
    title?: string;
    description?: string;
    content?: TrainingModuleContent;
    stepIndex: number;
    contentIndex: number;
    totalSteps: number;
    totalContents: number;
}

export const TrainingWizard: React.FC<TrainingWizardProps> = ({ onClose }) => {
    const { usecases } = useAppContext();
    const [minimized, setMinimized] = useState(false);
    const [module, setModule] = useState<TrainingModule>();

    const onMinimize = useCallback(() => {
        setMinimized(minimized => !minimized);
    }, []);

    useEffect(() => {
        setMinimized(false);
    }, []);

    useEffect(() => {
        usecases.getModule().then(setModule);
    }, [usecases]);

    if (!module) return null;

    const wizardSteps: WizardStep[] = _.flatMap(module.steps, ({ title, contents }, step) =>
        contents.map((content, position) => ({
            key: `${module.id}-${step}-${position}`,
            module,
            label: "Select your location",
            component: MarkdownContentStep,
            props: {
                title,
                content,
                stepIndex: step,
                contentIndex: position,
                totalSteps: module.steps.length,
                totalContents: contents.length,
            },
        }))
    );

    return (
        <StyledModal
            onClose={onClose}
            onMinimize={onMinimize}
            minimized={minimized}
            allowDrag={true}
        >
            <StyledWizard
                useSnackFeedback={true}
                initialStepKey={wizardSteps[0].key}
                StepperComponent={minimized ? EmptyComponent : Stepper}
                NavigationComponent={minimized ? EmptyComponent : Navigation}
                steps={wizardSteps}
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
        padding: inherit;
        height: 100%;
    }
`;

const StyledModal = styled(Modal)`
    position: fixed;
    margin: 6px;
    bottom: 20px;
    right: 40px;
    width: 450px;
    height: 500px;

    ${ModalContent} {
        padding: 0;
        max-height: 320px;
        text-align: justify;
    }
`;

const EmptyComponent = () => null;
