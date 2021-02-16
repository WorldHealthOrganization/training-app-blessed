import { Wizard, WizardStep } from "@eyeseetea/d2-ui-components";
import _ from "lodash";
import React from "react";
import { useLocation } from "react-router-dom";
import { TrainingModule, trainingModuleValidations } from "../../../domain/entities/TrainingModule";
import { validateModel } from "../../../domain/entities/Validation";
import { moduleCreationWizardSteps, ModuleCreationWizardStepProps } from "./steps";

export interface ModuleCreationWizardProps {
    className?: string;
    isEdit: boolean;
    onCancel: () => void;
    onClose: () => void;
    module: TrainingModule;
    onChange: (update: TrainingModule | ((prev: TrainingModule) => TrainingModule)) => void;
}

export const ModuleCreationWizard: React.FC<ModuleCreationWizardProps> = ({
    className,
    isEdit,
    onCancel,
    onClose,
    module,
    onChange,
}) => {
    const location = useLocation();

    const props: ModuleCreationWizardStepProps = { module, onChange, onCancel, onClose, isEdit };
    const steps = moduleCreationWizardSteps.map(step => ({ ...step, props }));

    const onStepChangeRequest = async (_currentStep: WizardStep, newStep: WizardStep) => {
        const index = _(steps).findIndex(step => step.key === newStep.key);
        return _.take(steps, index).flatMap(({ validationKeys }) =>
            validateModel(module, trainingModuleValidations, validationKeys).map(({ description }) => description)
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
