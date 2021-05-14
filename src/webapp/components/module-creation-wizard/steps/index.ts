import { WizardStep } from "@eyeseetea/d2-ui-components";
import { PartialTrainingModule } from "../../../../domain/entities/TrainingModule";
import i18n from "../../../../locales";
import { AccessStep } from "./AccessStep";
import { ContentsStep } from "./ContentsStep";
import { GeneralInfoStep } from "./GeneralInfoStep";
import { SummaryStep } from "./SummaryStep";
import { WelcomePageStep } from "./WelcomePageStep";

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
        validationKeys: ["id", "name.referenceValue"],
    },
    {
        key: "welcome-page",
        label: i18n.t("Welcome page"),
        component: WelcomePageStep,
        validationKeys: ["contents.welcome.referenceValue"],
    },
    {
        key: "contents",
        label: i18n.t("Contents"),
        component: ContentsStep,
        validationKeys: ["contents.steps"],
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
