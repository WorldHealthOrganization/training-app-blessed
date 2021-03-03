import i18n from "@eyeseetea/d2-ui-components/locales";
import React, { useCallback } from "react";
import styled from "styled-components";
import { TranslatableText } from "../../../../domain/entities/TranslatableText";
import { updateTranslation } from "../../../../domain/helpers/TrainingModuleHelpers";
import { useAppContext } from "../../../contexts/app-context";
import { MarkdownEditor } from "../../markdown-editor/MarkdownEditor";
import { MarkdownViewer } from "../../markdown-viewer/MarkdownViewer";
import { ModalBody } from "../../modal";
import { ModuleCreationWizardStepProps } from "./index";

export const WelcomePageStep: React.FC<ModuleCreationWizardStepProps> = ({ module, onChange }) => {
    const { usecases } = useAppContext();

    const onChangeTranslation = useCallback(
        (text: TranslatableText, value: string) => {
            onChange(module => updateTranslation(module, text.key, value));
        },
        [onChange]
    );

    return (
        <Row>
            <h3>{i18n.t("Welcome page")}</h3>
            <MarkdownEditor
                value={module.contents.welcome.referenceValue}
                onChange={value => onChangeTranslation(module.contents.welcome, value)}
                markdownPreview={markdown => <StepPreview value={markdown} />}
                onUpload={data => usecases.instance.uploadFile(data)}
            />
        </Row>
    );
};

const Row = styled.div`
    margin-bottom: 25px;
`;

const StyledModalBody = styled(ModalBody)`
    max-width: 600px;
`;

const StepPreview: React.FC<{
    className?: string;
    value?: string;
}> = ({ className, value }) => {
    if (!value) return null;

    return (
        <StyledModalBody className={className}>
            <MarkdownViewer source={value} center={true} />
        </StyledModalBody>
    );
};
