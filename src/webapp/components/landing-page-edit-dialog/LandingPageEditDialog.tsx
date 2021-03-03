import {
    ConfirmationDialog,
    ConfirmationDialogProps,
    MultipleDropdown,
    useSnackbar
} from "@eyeseetea/d2-ui-components";
import { TextField } from "@material-ui/core";
import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { generateUid } from "../../../data/utils/uid";
import { LandingNode, LandingNodeType } from "../../../domain/entities/LandingPage";
import i18n from "../../../locales";
import { useAppContext } from "../../contexts/app-context";
import { MarkdownEditor } from "../markdown-editor/MarkdownEditor";
import { MarkdownViewer } from "../markdown-viewer/MarkdownViewer";
import { ModalBody } from "../modal";

const buildDefaultNode = (type: LandingNodeType, parent: string, order: number) => {
    return {
        id: generateUid(),
        type,
        parent,
        icon: "",
        order,
        name: { key: "", referenceValue: "", translations: {} },
        title: undefined,
        content: undefined,
        children: [],
        modules: [],
    };
};

export const LandingPageEditDialog: React.FC<LandingPageEditDialogProps> = props => {
    const { type, parent, order, initialNode, onSave } = props;

    const { modules, translate, usecases } = useAppContext();
    const snackbar = useSnackbar();

    const [value, setValue] = useState<LandingNode>(initialNode ?? buildDefaultNode(type, parent, order));

    const items = useMemo(() => modules.map(({ id, name }) => ({ value: id, text: translate(name) })), [
        modules,
        translate,
    ]);

    const save = useCallback(() => {
        if (!value.name) {
            snackbar.error(i18n.t("Field name is mandatory"));
            return;
        }

        onSave({
            ...value,
            name: { ...value.name, key: `${value.id}-name` },
            title: value.title ? { ...value.title, key: `${value.id}-title` } : undefined,
            content: value.content ? { ...value.content, key: `${value.id}-content` } : undefined,
        });
    }, [value, onSave, snackbar]);

    const onChangeField = useCallback((field: keyof LandingNode) => {
        return (event: React.ChangeEvent<{ value: unknown }>) => {
            switch (field) {
                case "name":
                case "title": {
                    const referenceValue = event.target.value as string;
                    setValue(node => {
                        return { ...node, [field]: { key: "name", referenceValue, translations: {} } };
                    });
                    return;
                }
            }
        };
    }, []);

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
                />
            </Row>

            <Row>
                <TextField
                    fullWidth={true}
                    label={i18n.t("Name *")}
                    value={value.name.referenceValue}
                    onChange={onChangeField("name")}
                />
            </Row>

            <Row>
                <TextField
                    fullWidth={true}
                    label={i18n.t("Title")}
                    value={value.title?.referenceValue ?? ""}
                    onChange={onChangeField("title")}
                />
            </Row>

            <Row>
                <h3>{i18n.t("Icon")}</h3>

                <IconUpload>
                    {value.icon ? (
                        <IconContainer>
                            <img src={value.icon} alt={`Page icon`} />
                        </IconContainer>
                    ) : null}

                    <FileInput type="file" onChange={handleFileUpload} />
                </IconUpload>
            </Row>

            <Row>
                <h3>{i18n.t("Modules")}</h3>

                <ModuleSelector
                    label={i18n.t("Modules assigned")}
                    items={items}
                    values={value.modules}
                    onChange={modules => setValue(landing => ({ ...landing, modules }))}
                />
            </Row>

            <Row>
                <h3>{i18n.t("Contents")}</h3>

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
        </ConfirmationDialog>
    );
};

export interface LandingPageEditDialogProps extends Omit<ConfirmationDialogProps, "onSave"> {
    initialNode?: LandingNode;
    type: LandingNodeType;
    parent: string;
    order: number;
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

const ModuleSelector = styled(MultipleDropdown)`
    width: 100%;
`;
