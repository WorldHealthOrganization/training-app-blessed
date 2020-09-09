import { Wizard } from "d2-ui-components";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Modal } from "../modal/Modal";
import { Navigation } from "./navigation/Navigation";
import { Stepper } from "./stepper/Stepper";
import { GeneralInfoStep } from "./steps/GeneralInfoStep";

export interface TrainingWizardProps {
    onClose: () => void;
}

export const TrainingWizard: React.FC<TrainingWizardProps> = ({ onClose }) => {
    const [minimized, setMinimized] = useState(false);

    const onMinimize = useCallback(() => {
        setMinimized(minimized => !minimized);
    }, []);

    useEffect(() => {
        setMinimized(false);
    }, []);

    return (
        <StyledModal onClose={onClose} onMinimize={onMinimize} minimized={minimized}>
            <StyledWizard
                useSnackFeedback={true}
                initialStepKey={"general-info"}
                StepperComponent={minimized ? EmptyComponent : Stepper}
                NavigationComponent={minimized ? EmptyComponent : Navigation}
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
        </StyledModal>
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

const StyledModal = styled(Modal)`
    position: fixed;
    margin: 6px;
    bottom: 20px;
    right: 40px;
    width: 450px;
    height: 500px;
`;

const EmptyComponent = () => null;
