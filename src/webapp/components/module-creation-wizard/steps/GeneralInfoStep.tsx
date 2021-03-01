import i18n from "@eyeseetea/d2-ui-components/locales";
import { TextField } from "@material-ui/core";
import _, { Dictionary } from "lodash";
import React, { useCallback, useState } from "react";
import { FileRejection } from "react-dropzone";
import styled from "styled-components";
import { TrainingModule } from "../../../../domain/entities/TrainingModule";
import { TranslatableText } from "../../../../domain/entities/TranslatableText";
import { updateTranslation } from "../../../../domain/helpers/TrainingModuleHelpers";
import { useAppContext } from "../../../contexts/app-context";
import { Dropzone } from "../../dropzone/Dropzone";
import { MarkdownEditor } from "../../markdown-editor/MarkdownEditor";
import { MarkdownViewer } from "../../markdown-viewer/MarkdownViewer";
import { ModalBody } from "../../modal";
import { ModuleCreationWizardStepProps } from "./index";

export const GeneralInfoStep: React.FC<ModuleCreationWizardStepProps> = ({ module, onChange, isEdit }) => {
    const { usecases } = useAppContext();

    const [errors, setErrors] = useState<Dictionary<string | undefined>>({});

    const onChangeField = useCallback(
        (field: keyof TrainingModule) => {
            return (event: React.ChangeEvent<{ value: unknown }>) => {
                switch (field) {
                    case "id": {
                        const id = event.target.value as string;
                        onChange(module => {
                            return { ...module, id: _.kebabCase(id) };
                        });
                        return;
                    }
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

    const handleFileUpload = useCallback(
        async (files: File[], rejections: FileRejection[]) => {
            if (!files[0] || rejections.length > 0) return;

            const data = await files[0].arrayBuffer();
            const icon = await usecases.instance.uploadFile(data);
            onChange(module => ({ ...module, icon }));
        },
        [usecases, onChange]
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

            <Row style={{ marginBottom: 80 }}>
                <h3>{i18n.t("Icon")}</h3>

                <div style={{ display: "flex" }}>
                    {module.icon ? (
                        <IconContainer>
                            <img src={module.icon} alt={`Module icon`} />
                        </IconContainer>
                    ) : null}

                    <Dropzone visible={true} onDrop={handleFileUpload} maxFiles={1}>
                        <Space />
                    </Dropzone>
                </div>
            </Row>

            <Row>
                <h3>{i18n.t("Welcome page")}</h3>
                <MarkdownEditor
                    value={module.contents.welcome.referenceValue}
                    onChange={value => onChangeTranslation(module.contents.welcome, value)}
                    markdownPreview={markdown => <StepPreview value={markdown} />}
                    onUpload={data => usecases.instance.uploadFile(data)}
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

const IconContainer = styled.div`
    margin-right: 60px;
    flex-shrink: 0;
    height: 12vh;
    width: 12vh;

    img {
        width: 100%;
        height: auto;
        padding: 10px;
        user-drag: none;
    }
`;

const Space = styled.div`
    height: 100px;
    min-width: 500px;
`;
