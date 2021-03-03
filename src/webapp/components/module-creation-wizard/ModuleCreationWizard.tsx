import { Wizard, WizardStep } from "@eyeseetea/d2-ui-components";
import _ from "lodash";
import React from "react";
import { useLocation } from "react-router-dom";
import { trainingModuleValidations } from "../../../domain/entities/TrainingModule";
import { validateModel } from "../../../domain/entities/Validation";
import { ModuleCreationWizardStepProps, moduleCreationWizardSteps } from "./steps";

export interface ModuleCreationWizardProps extends ModuleCreationWizardStepProps {
    className?: string;
}

export const ModuleCreationWizard: React.FC<ModuleCreationWizardProps> = props => {
    const location = useLocation();

    const { className, ...stepProps } = props;
    const steps = moduleCreationWizardSteps.map(step => ({ ...step, props: stepProps }));

    const onStepChangeRequest = async (_currentStep: WizardStep, newStep: WizardStep) => {
        const index = _(steps).findIndex(step => step.key === newStep.key);
        return _.take(steps, index).flatMap(({ validationKeys }) =>
            validateModel(props.module, trainingModuleValidations, validationKeys).map(({ description }) => description)
        );
    };

    const urlHash = location.hash.slice(1);
    const stepExists = steps.find(step => step.key === urlHash);
    const firstStepKey = steps.map(step => step.key)[0];
    const initialStepKey = stepExists ? urlHash : firstStepKey;

    return (
        <div className={className}>
            <Wizard
                useSnackFeedback={true}
                onStepChangeRequest={onStepChangeRequest}
                initialStepKey={initialStepKey}
                lastClickableStepIndex={steps.length - 1}
                steps={steps}
            />
        </div>
    );
};
