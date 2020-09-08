import { Wizard } from "d2-ui-components";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Modal } from "./modal/Modal";
import { Navigation } from "./navigation/Navigation";
import { Stepper } from "./stepper/Stepper";

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
        <Modal onClose={onClose} onMinimize={onMinimize} minimized={minimized}>
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
        <ContentWrapper>
            <p style={{ margin: 0, color: "#fff" }}>
                {"Placeholder for the contents ".repeat(100)}
            </p>
        </ContentWrapper>
    );
};

const ContentWrapper = styled.div`
    margin: 0;
    max-height: 320px;
    overflow-x: hidden;
    overflow-y: auto;

    ::-webkit-scrollbar {
        width: 4px;
    }

    ::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb {
        background: #fff;
        border-radius: 4px;
    }
`;

const EmptyComponent = () => null;
