import { Wizard } from "d2-ui-components";
import React from "react";
import styled from "styled-components";
import { Modal } from "./modal/Modal";
import { Navigation } from "./navigation/Navigation";
import { Stepper } from "./stepper/Stepper";

export interface TrainingWizardProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export const TrainingWizard: React.FC<TrainingWizardProps> = ({ open, setOpen }) => {
    if (!open) return null;

    return (
        <Modal onClose={() => setOpen(false)}>
            <StyledWizard
                useSnackFeedback={true}
                initialStepKey={"general-info"}
                StepperComponent={Stepper}
                NavigationComponent={Navigation}
                steps={[
                    {
                        key: "general-info",
                        label: "General info",
                        component: GeneralInfoStep,
                    },
                    {
                        key: "general-info2",
                        label: "General info",
                        component: GeneralInfoStep,
                    },
                    {
                        key: "general-info3",
                        label: "General info",
                        component: GeneralInfoStep,
                    },
                ]}
            />
        </Modal>
    );
};

const StyledWizard = styled(Wizard)`
    .MuiPaper-root {
        box-shadow: none;
        background-color: inherit;
        margin: inherit;
        padding: inherit;
    }
`;

const GeneralInfoStep = () => {
    return (
        <React.Fragment>
            <p style={{ marginBottom: 130, color: "#fff" }}>Placeholder for the contents</p>
        </React.Fragment>
    );
};
