import { WizardStep } from "@eyeseetea/d2-ui-components";
import { PartialTrainingModule } from "../../../../domain/entities/TrainingModule";
import i18n from "../../../../locales";
import { AccessStep } from "./AccessStep";
import { ContentsStep } from "./ContentsStep";
import { GeneralInfoStep } from "./GeneralInfoStep";
import { SummaryStep } from "./SummaryStep";

export interface ModuleCreationWizardStep extends WizardStep {
    validationKeys: string[];
    showOnSyncDialog?: boolean;
    props?: ModuleCreationWizardStepProps;
}

export interface ModuleCreationWizardStepProps {
    module: PartialTrainingModule;
    onChange: (update: PartialTrainingModule | ((prev: PartialTrainingModule) => PartialTrainingModule)) => void;
    onCancel: () => void;
    onClose: () => void;
    onSave: () => Promise<void>;
    isEdit: boolean;
}

export const moduleCreationWizardSteps: ModuleCreationWizardStep[] = [
    {
        key: "general-info",
        label: i18n.t("General info"),
        component: GeneralInfoStep,
        validationKeys: [],
    },
    {
        key: "contents",
        label: i18n.t("Contents"),
        component: ContentsStep,
        validationKeys: [],
    },
    {
        key: "access",
        label: i18n.t("Access"),
        component: AccessStep,
        validationKeys: [],
    },
    {
        key: "summary",
        label: i18n.t("Summary"),
        component: SummaryStep,
        validationKeys: [],
    },
];
