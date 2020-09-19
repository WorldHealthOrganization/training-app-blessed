import React from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import { ModalContent } from "../../modal/ModalContent";
import { TrainingWizardStepProps } from "../TrainingWizard";
import { StepHeader } from "./StepHeader";

export const MarkdownContentStep: React.FC<TrainingWizardStepProps> = ({
    content,
    title = "",
    stepIndex,
    minimized,
}) => {
    return (
        <ModalContent>
            <StepHeader index={stepIndex + 1} title={title} />
            {content && !minimized ? <Markdown source={content.text} escapeHtml={false} /> : null}
        </ModalContent>
    );
};

const Markdown = styled(ReactMarkdown)`
    color: white;
    padding: 5px 20px 0 20px;

    h1 {
        font-size: 32px;
        line-height: 47px;
        font-weight: 300;
        margin: 0px 0px 30px 0px;
    }

    p {
        font-size: 17px;
        font-weight: 300;
        line-height: 28px;
        text-align: justify;
    }

    img {
        width: 100%;
    }
`;
