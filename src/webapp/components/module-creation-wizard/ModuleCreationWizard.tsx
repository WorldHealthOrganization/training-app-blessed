import { Wizard, WizardStep } from "@eyeseetea/d2-ui-components";
import _ from "lodash";
import React, { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { trainingModuleValidations } from "../../../domain/entities/TrainingModule";
import { validateModel } from "../../../domain/entities/Validation";
import i18n from "../../../locales";
import { useAppContext } from "../../contexts/app-context";
import { ModuleCreationWizardStepProps, moduleCreationWizardSteps } from "./steps";

export interface ModuleCreationWizardProps extends ModuleCreationWizardStepProps {
    className?: string;
}

export const ModuleCreationWizard: React.FC<ModuleCreationWizardProps> = props => {
    const location = useLocation();
    const { modules } = useAppContext();

    const { className, ...stepProps } = props;

    const steps = useMemo(() => moduleCreationWizardSteps.map(step => ({ ...step, props: stepProps })), [stepProps]);

    const onStepChangeRequest = useCallback(
        async (_currentStep: WizardStep, newStep: WizardStep) => {
            const index = _(steps).findIndex(step => step.key === newStep.key);

            return _.take(steps, index).flatMap(({ validationKeys }) => {
                const validationErrors = validateModel(props.module, trainingModuleValidations, validationKeys).map(
                    ({ description }) => description
                );

                return _.compact([
                    ...validationErrors,
                    // Validate duplicated code for a given module
                    validationKeys.includes("id") && !!modules.find(({ id }) => id === props.module.id)
                        ? i18n.t("Code {{code}} already exists", { code: props.module.id })
                        : undefined,
                ]);
            });
        },
        [props.module, steps, modules]
    );

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
