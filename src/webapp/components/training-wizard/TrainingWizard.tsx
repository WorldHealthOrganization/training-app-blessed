import { Wizard, WizardNavigationProps, WizardStepperProps } from "@eyeseetea/d2-ui-components";
import _ from "lodash";
import React, { useCallback, useMemo, useRef } from "react";
import styled from "styled-components";
import { extractStepFromKey, PartialTrainingModule } from "../../../domain/entities/TrainingModule";
import { TranslateMethod } from "../../../domain/entities/TranslatableText";
import { Navigation } from "./navigation/Navigation";
import { Stepper } from "./stepper/Stepper";
import { MarkdownContentStep } from "./steps/MarkdownContentStep";

export interface TrainingWizardProps {
    className?: string;
    translate: TranslateMethod;
    module: PartialTrainingModule;
    onClose?: () => void;
    onGoHome?: () => void;
    currentStep: string;
    onChangeStep: (step: number, contents: number) => void;
    minimized?: boolean;
    onMinimize?: () => void;
    updateProgress?: (moduleId: string, progress: number) => Promise<void>;
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
    const { className, translate, module, currentStep, onChangeStep, minimized, updateProgress } = props;
    const lastStep = useRef<string>();

    const steps = useMemo(() => {
        if (!module) return [];
        return _.flatMap(module.contents.steps, ({ title, subtitle, pages }, step) =>
            pages.map((content, position) => {
                const props: TrainingWizardStepProps = {
                    title: translate(title),
                    subtitle: subtitle ? translate(subtitle) : undefined,
                    content: translate(content),
                    stepIndex: step,
                    contentIndex: position,
                    totalSteps: module.contents.steps.length,
                    totalContents: pages.length,
                    minimized,
                };

                return {
                    key: `${module.id}-${step + 1}-${position + 1}`,
                    module,
                    label: "Select your location",
                    component: MarkdownContentStep,
                    props,
                };
            })
        );
    }, [module, minimized, translate]);

    const validStepKey = useMemo(() => {
        return steps.find(step => step.key === currentStep) ? currentStep : steps[0]?.key;
    }, [currentStep, steps]);

    const onStepChange = useCallback(
        async (stepKey: string) => {
            if (!module || lastStep.current === stepKey) return;

            const currentStep = extractStepFromKey(stepKey);
            if (!currentStep) return;

            const prevStep = extractStepFromKey(lastStep?.current ?? "");
            const isOneStepChange = !!prevStep && Math.abs(currentStep.step - prevStep.step) === 1;
            const shouldUpdateProgress = isOneStepChange && module.progress && !module.progress.completed;

            if (updateProgress && shouldUpdateProgress) {
                await updateProgress(module.id, currentStep.step - 1);
            }

            lastStep.current = stepKey;
            onChangeStep(currentStep.step, currentStep.content);
        },
        [module, updateProgress]
    );

    const WizardStepper = (props: WizardStepperProps) => <Stepper {...props} onMove={step => onChangeStep(step, 1)} />;
    const WizardNavigation = (props: WizardNavigationProps) => (
        <Navigation {...props} onMove={step => onChangeStep(step, 1)} />
    );

    if (!module || steps.length === 0) return null;

    return (
        <StyledWizard
            className={className}
            steps={steps}
            stepKey={validStepKey}
            onStepChange={onStepChange}
            initialStepKey={steps[0]?.key}
            StepperComponent={minimized ? EmptyComponent : WizardStepper}
            NavigationComponent={minimized ? EmptyComponent : WizardNavigation}
        />
    );
};

const StyledWizard = styled(Wizard)`
    height: 100%;

    .MuiPaper-root {
        box-shadow: none;
        background-color: inherit;
        margin: inherit;
        padding: 0;
    }
`;

const EmptyComponent = () => null;
