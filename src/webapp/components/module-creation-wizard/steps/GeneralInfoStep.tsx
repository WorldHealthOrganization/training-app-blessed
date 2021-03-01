import i18n from "@eyeseetea/d2-ui-components/locales";
import { TextField } from "@material-ui/core";
import { Dictionary } from "lodash";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { TrainingModule } from "../../../../domain/entities/TrainingModule";
import { TranslatableText } from "../../../../domain/entities/TranslatableText";
import { updateTranslation } from "../../../../domain/helpers/TrainingModuleHelpers";
import { MarkdownEditor } from "../../markdown-editor/MarkdownEditor";
import { MarkdownViewer } from "../../markdown-viewer/MarkdownViewer";
import { ModalBody } from "../../modal";
import { ModuleCreationWizardStepProps } from "./index";

export const GeneralInfoStep: React.FC<ModuleCreationWizardStepProps> = ({ module, onChange, isEdit }) => {
    const [errors, setErrors] = useState<Dictionary<string | undefined>>({});

    const onChangeField = useCallback(
        (field: keyof TrainingModule) => {
            return (event: React.ChangeEvent<{ value: unknown }>) => {
                switch (field) {
                    case "translation": {
                        const project = event.target.value as string;
                        onChange(module => {
                            return { ...module, translation: { provider: "poeditor", project } };
                        });
                        return;
                    }
                    default: {
                        onChange(module => {
                            return { ...module, [field]: event.target.value as string };
                        });
                    }
                }
                setErrors(errors => ({
                    ...errors,
                    // TODO: Add validation from model
                    [field]: !event.target.value ? i18n.t("Field must have a value") : undefined,
                }));
            };
        },
        [onChange]
    );

    const onChangeTranslation = useCallback(
        (text: TranslatableText, value: string) => {
            onChange(module => updateTranslation(module, text.key, value));
        },
        [onChange]
    );

    return (
        <React.Fragment>
            <Row>
                <TextField
                    disabled={!!isEdit}
                    fullWidth={true}
                    label={i18n.t("Code *")}
                    value={module.id}
                    onChange={onChangeField("id")}
                    error={!!errors["id"]}
                    helperText={errors["id"]}
                />
            </Row>

            <Row>
                <TextField
                    fullWidth={true}
                    label={i18n.t("Name *")}
                    value={module.name.referenceValue}
                    onChange={event => onChangeTranslation(module.name, event.target.value)}
                    error={!!errors["name"]}
                    helperText={errors["name"]}
                />
            </Row>

            <Row>
                <TextField
                    fullWidth={true}
                    label={i18n.t("PoEditor Project id")}
                    value={module.translation.provider !== "NONE" ? module.translation.project : ""}
                    onChange={onChangeField("translation")}
                />
            </Row>

            <Row>
                <h3>{i18n.t("Welcome page")}</h3>
                <MarkdownEditor
                    value={module.contents.welcome.referenceValue}
                    onChange={value => onChangeTranslation(module.contents.welcome, value)}
                    markdownPreview={markdown => <StepPreview value={markdown} />}
                />
            </Row>
        </React.Fragment>
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
