import { Wizard, WizardStep } from "d2-ui-components";
import _ from "lodash";
import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import {
    extractStepFromKey,
    TrainingModule,
    TrainingModuleContent,
} from "../../../domain/entities/TrainingModule";
import { useAppContext } from "../../contexts/app-context";
import { Modal } from "../modal/Modal";
import { ModalContent } from "../modal/ModalContent";
import { Navigation } from "./navigation/Navigation";
import { Stepper } from "./stepper/Stepper";
import { MarkdownContentStep } from "./steps/MarkdownContentStep";

export interface TrainingWizardProps {
    onClose: () => void;
    module?: TrainingModule;
}

export interface TrainingWizardStepProps {
    title?: string;
    description?: string;
    content?: TrainingModuleContent;
    minimized: boolean;
    stepIndex: number;
    contentIndex: number;
    totalSteps: number;
    totalContents: number;
}

export const TrainingWizard: React.FC<TrainingWizardProps> = ({ onClose, module }) => {
    const { appState, setAppState } = useAppContext();

    const minimized = useMemo(
        () => appState.type === "TRAINING" && appState.state === "MINIMIZED",
        [appState]
    );

    const wizardSteps: WizardStep[] = useMemo(() => {
        if (!module) return [];
        return _.flatMap(module.steps, ({ title, contents }, step) =>
            contents.map((content, position) => ({
                key: `${module.key}-${step + 1}-${position + 1}`,
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
                    minimized,
                },
            }))
        );
    }, [module, minimized]);

    const stepKey = useMemo(() => {
        if (appState.type !== "TRAINING" || !module) return undefined;
        const key = `${module.key}-${appState.step}-${appState.content}`;
        return wizardSteps.find(step => step.key === key) ? key : wizardSteps[0].key;
    }, [appState, module, wizardSteps]);

    const onStepChange = useCallback(
        (stepKey: string) => {
            const result = extractStepFromKey(stepKey);
            if (!result) return;

            setAppState(appState => {
                if (appState.type !== "TRAINING") return appState;
                return { ...appState, ...result };
            });
        },
        [setAppState]
    );

    const onMinimize = useCallback(() => {
        setAppState(appState => {
            if (appState.type !== "TRAINING") return appState;
            const state = appState.state === "MINIMIZED" ? "OPEN" : "MINIMIZED";
            return { ...appState, state };
        });
    }, [setAppState]);

    if (!module || wizardSteps.length === 0) return null;

    return (
        <StyledModal
            onClose={onClose}
            onMinimize={onMinimize}
            minimized={minimized}
            allowDrag={true}
        >
            <StyledWizard
                steps={wizardSteps}
                stepKey={stepKey}
                onStepChange={onStepChange}
                initialStepKey={wizardSteps[0].key}
                StepperComponent={minimized ? EmptyComponent : Stepper}
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
    width: 450px;
    height: ${({ minimized }) => (minimized ? "inherit" : "500px")};

    ${ModalContent} {
        padding: 0;
        max-height: 320px;
    }

    ${StyledWizard} .MuiPaper-root {
        padding: ${({ minimized }) => (minimized ? "35px 0px 20px" : "inherit")};
    }
`;

const EmptyComponent = () => null;
