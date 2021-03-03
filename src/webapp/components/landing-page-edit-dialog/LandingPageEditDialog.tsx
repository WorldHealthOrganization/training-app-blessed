import {
    ConfirmationDialog,
    ConfirmationDialogProps,
    MultipleDropdown,
    useSnackbar
} from "@eyeseetea/d2-ui-components";
import { TextField } from "@material-ui/core";
import _ from "lodash";
import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { generateUid } from "../../../data/utils/uid";
import { LandingNode, LandingNodeType } from "../../../domain/entities/LandingPage";
import i18n from "../../../locales";
import { Dictionary } from "../../../types/utils";
import { useAppContext } from "../../contexts/app-context";
import { MarkdownEditor } from "../markdown-editor/MarkdownEditor";
import { MarkdownViewer } from "../markdown-viewer/MarkdownViewer";
import { ModalBody } from "../modal";

const buildDefaultNode = (type: LandingNodeType, parent: string) => {
    return {
        id: generateUid(),
        type,
        parent,
        icon: "",
        title: { key: "", referenceValue: "", translations: {} },
        content: undefined,
        children: [],
        modules: [],
    };
};

export const LandingPageEditDialog: React.FC<LandingPageEditDialogProps> = props => {
    const { type, parent, initialNode, onSave } = props;

    const { modules, translate, usecases, landings } = useAppContext();
    const snackbar = useSnackbar();

    const [value, setValue] = useState<LandingNode>(initialNode ?? buildDefaultNode(type, parent));
    const [errors, setErrors] = useState<Dictionary<string | undefined>>({});

    const items = useMemo(() => modules.map(({ id, name }) => ({ value: id, text: translate(name) })), [
        modules,
        translate,
    ]);

    const validate = useCallback(
        (filter?: string) => {
            const errors: Dictionary<string | undefined> = {
                id: flattenRows(landings).find(({ id }) => id === value.id) ? "Code must be unique" : undefined,
                title: !value.title ? "Field name must have a value" : undefined,
                icon: value.type !== "sub-section" && !value.icon ? "Page must have an icon" : undefined,
            };

            return filter ? { [filter]: errors[filter] } : errors;
        },
        [value, landings]
    );

    const save = useCallback(() => {
        const validations = _(errors).values().flatten().compact().value();
        if (validations.length > 0) {
            snackbar.error(validations.join("\n"));
            return;
        }

        const id = _.kebabCase(value.id);

        onSave({
            ...value,
            title: { ...value.title, key: `${id}-title` },
            content: value.content ? { ...value.content, key: `${id}-content` } : undefined,
        });
    }, [value, onSave, snackbar, errors]);

    const onChangeField = useCallback(
        (field: keyof LandingNode) => {
            return (event: React.ChangeEvent<{ value: unknown }>) => {
                switch (field) {
                    case "title": {
                        const referenceValue = event.target.value as string;
                        setValue(node => {
                            return { ...node, [field]: { key: "name", referenceValue, translations: {} } };
                        });
                        setErrors(errors => ({ ...errors, ...validate(field) }));
                        return;
                    }
                    case "content": {
                        const referenceValue = event.target.value as string;
                        setValue(node => {
                            return { ...node, [field]: { key: "name", referenceValue, translations: {} } };
                        });
                        return;
                    }
                }
            };
        },
        [validate]
    );

    const handleFileUpload = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files ? event.target.files[0] : undefined;
            file?.arrayBuffer().then(async data => {
                const icon = await usecases.instance.uploadFile(data);
                setValue(node => ({ ...node, icon }));
            });
        },
        [usecases]
    );

    return (
        <ConfirmationDialog fullWidth={true} {...props} maxWidth={"md"} onSave={save}>
            <Row>
                <TextField
                    disabled={true}
                    fullWidth={true}
                    label={i18n.t("Identifier")}
                    value={value.id}
                    onChange={onChangeField("id")}
                    error={!!errors["id"]}
                    helperText={errors["id"]}
                />
            </Row>

            <Row>
                <TextField
                    fullWidth={true}
                    label={i18n.t("Title *")}
                    value={value.title.referenceValue}
                    onChange={onChangeField("title")}
                    error={!!errors["title"]}
                    helperText={errors["title"]}
                />
            </Row>

            <Row>
                <MarkdownEditor
                    value={value.content?.referenceValue ?? ""}
                    onChange={referenceValue =>
                        setValue(landing => ({
                            ...landing,
                            content: { key: `${value.id}-content`, referenceValue, translations: {} },
                        }))
                    }
                    markdownPreview={markdown => <StepPreview value={markdown} />}
                    onUpload={data => usecases.instance.uploadFile(data)}
                />
            </Row>

            {value.type !== "sub-section" ? (
                <Row style={{ marginBottom: 80 }}>
                    <h3>{i18n.t("Icon *")}</h3>

                    <IconUpload>
                        {value.icon ? (
                            <IconContainer>
                                <img src={value.icon} alt={`Page icon`} />
                            </IconContainer>
                        ) : null}

                        <FileInput type="file" onChange={handleFileUpload} />
                    </IconUpload>
                </Row>
            ) : null}

            <Row>
                <MultipleDropdown label={i18n.t("Modules assigned")} items={items} values={value.modules} onChange={modules => setValue(landing => ({...landing, modules }))} />
            </Row>
        </ConfirmationDialog>
    );
};

export interface LandingPageEditDialogProps extends Omit<ConfirmationDialogProps, "onSave"> {
    initialNode?: LandingNode;
    type: LandingNodeType;
    parent: string;
    onSave: (value: LandingNode) => void;
}

const Row = styled.div`
    margin-bottom: 25px;
`;

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

const IconUpload = styled.div`
    display: flex;
    align-items: center;
`;

const FileInput = styled.input`
    outline: none;
`;

const flattenRows = (rows: LandingNode[]): LandingNode[] => {
    return _.flatMap(rows, row => [row, ...flattenRows(row.children)]);
};

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
