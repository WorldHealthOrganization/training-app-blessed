import React from "react";
import { MarkdownViewer } from "../../markdown-viewer/MarkdownViewer";
import { ModalContent } from "../../modal/ModalContent";
import { TrainingWizardStepProps } from "../TrainingWizard";
import { StepHeader } from "./StepHeader";

export const MarkdownContentStep: React.FC<TrainingWizardStepProps> = ({
    content,
    title = "",
    stepIndex = 0,
    minimized,
}) => {
    return (
        <ModalContent>
            <StepHeader index={stepIndex + 1} title={title} />
            {content && !minimized ? <MarkdownViewer source={content} escapeHtml={false} /> : null}
        </ModalContent>
    );
};
