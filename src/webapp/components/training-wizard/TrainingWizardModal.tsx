import React from "react";
import styled from "styled-components";
import { Modal } from "../modal/Modal";
import { TrainingWizard, TrainingWizardProps } from "./TrainingWizard";

export const TrainingWizardModal: React.FC<TrainingWizardProps> = props => {
    const { onClose, onGoHome, onMinimize, minimized } = props;

    return (
        <StyledModal
            onClose={onClose}
            onGoHome={onGoHome}
            onMinimize={onMinimize}
            minimized={minimized}
            allowDrag={true}
        >
            <TrainingWizard {...props} />
        </StyledModal>
    );
};

const StyledModal = styled(Modal)`
    position: fixed;
    margin: 6px;
    bottom: 20px;
    right: 40px;

    .MuiPaper-root {
        padding: ${({ minimized }) => (minimized ? "35px 0px 20px" : "inherit")};
    }
`;
