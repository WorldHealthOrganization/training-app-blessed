import { ConfirmationDialog, ConfirmationDialogProps, useSnackbar } from "@eyeseetea/d2-ui-components";
import { TextField } from "@material-ui/core";
import _ from "lodash";
import React, { ChangeEvent, useCallback, useState } from "react";
import styled from "styled-components";
import { LandingNode, LandingNodeType } from "../../../domain/entities/LandingPage";
import i18n from "../../../locales";
import { Dictionary } from "../../../types/utils";
import { useAppContext } from "../../contexts/app-context";

const buildDefaultNode = (type: LandingNodeType, parent: string) => {
    return {
        id: "",
        type,
        parent,
        name: { key: _.kebabCase(`id-name`), referenceValue: "", translations: {} },
        children: [],
        icon: "",
        title: undefined,
        description: undefined,
        moduleId: "",
    };
};

export const LandingPageEditDialog: React.FC<LandingPageEditDialogProps> = props => {
    const { type, parent, initialNode, onSave } = props;

    const { usecases, landings } = useAppContext();
    const snackbar = useSnackbar();

    const [value, setValue] = useState<LandingNode>(initialNode ?? buildDefaultNode(type, parent));
    const [errors, setErrors] = useState<Dictionary<string | undefined>>({});

    const validate = useCallback(
        (filter?: string) => {
            if (flattenRows(landings).find(({ id }) => id === value.id)) {
                snackbar.error("Code must be unique");
                return;
            }

            const errors: Dictionary<string | undefined> = {
                id: flattenRows(landings).find(({ id }) => id === value.id) ? "Code must be unique" : undefined,
                name: !value.name ? "Field name must have a value" : undefined,
                icon: value.type === "page" && !value.icon ? "Page must have an icon" : undefined,
                title: value.type === "page" && !value.title ? "Page must have a title" : undefined,
            };

            return filter ? { [filter]: errors[filter] } : errors;
        },
        [value, snackbar, landings]
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
            id,
            name: { ...value.name, key: `${id}-name` },
            title: value.title ? { ...value.title, key: `${id}-title` } : undefined,
            description: value.description ? { ...value.description, key: `${id}-description` } : undefined,
        });
    }, [value, onSave, snackbar, errors]);

    const onChangeField = useCallback(
        (field: keyof LandingNode) => {
            return (event: React.ChangeEvent<{ value: unknown }>) => {
                switch (field) {
                    case "id": {
                        const id = event.target.value as string;
                        setValue(node => {
                            return { ...node, id };
                        });
                        setErrors(errors => ({ ...errors, ...validate(field) }));
                        return;
                    }
                    case "name": {
                        const referenceValue = event.target.value as string;
                        setValue(node => {
                            return { ...node, [field]: { key: "name", referenceValue, translations: {} } };
                        });
                        setErrors(errors => ({ ...errors, ...validate(field) }));
                        return;
                    }
                    case "title":
                    case "description": {
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
                    disabled={!!initialNode}
                    fullWidth={true}
                    label={i18n.t("Code *")}
                    value={value.id}
                    onChange={onChangeField("id")}
                    error={!!errors["id"]}
                    helperText={errors["id"]}
                />
            </Row>

            <Row>
                <TextField
                    fullWidth={true}
                    label={i18n.t("Name *")}
                    value={value.name.referenceValue}
                    onChange={onChangeField("name")}
                    error={!!errors["name"]}
                    helperText={errors["name"]}
                />
            </Row>

            {value.id !== "root" ? (
                <Row>
                    <TextField
                        fullWidth={true}
                        label={i18n.t("Title")}
                        value={value.title?.referenceValue ?? ""}
                        onChange={onChangeField("title")}
                        error={!!errors["title"]}
                        helperText={errors["title"]}
                    />
                </Row>
            ) : null}

            {value.id !== "root" ? (
                <Row>
                    <TextField
                        fullWidth={true}
                        label={i18n.t("Description")}
                        value={value.description?.referenceValue ?? ""}
                        onChange={onChangeField("description")}
                        multiline={true}
                        error={!!errors["description"]}
                        helperText={errors["description"]}
                    />
                </Row>
            ) : null}

            {value.type === "page" ? (
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
