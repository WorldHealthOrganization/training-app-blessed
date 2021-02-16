import { WizardStep } from "@eyeseetea/d2-ui-components";
import { TrainingModule } from "../../../../domain/entities/TrainingModule";
import i18n from "../../../../locales";
import { GeneralInfoStep } from "./GeneralInfoStep";

export interface ModuleCreationWizardStep extends WizardStep {
    validationKeys: string[];
    showOnSyncDialog?: boolean;
    props?: ModuleCreationWizardStepProps;
}

export interface ModuleCreationWizardStepProps {
    module: TrainingModule;
    onChange: (module: TrainingModule) => void;
    onCancel: () => void;
    onClose: () => void;
    isEdit: boolean;
}

export const moduleCreationWizardSteps: ModuleCreationWizardStep[] = [
    {
        key: "general-info",
        label: i18n.t("General info"),
        component: GeneralInfoStep,
        validationKeys: [],
    },
];
