import TextField from "@material-ui/core/TextField";
import { ConfirmationDialog } from "d2-ui-components";
import _ from "lodash";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { TrainingModuleBuilder } from "../../../domain/entities/TrainingModule";
import i18n from "../../../locales";
import { Dictionary } from "../../../types/utils";
import { useAppContext } from "../../contexts/app-context";

export interface ModuleCreationDialogProps {
    builder?: TrainingModuleBuilder;
    onClose: () => void;
}

const defaultBuilder: TrainingModuleBuilder = {
    id: "",
    name: "",
    poEditorProject: "",
};

export const ModuleCreationDialog: React.FC<ModuleCreationDialogProps> = ({
    builder: editBuilder,
    onClose,
}) => {
    const { usecases } = useAppContext();

    const [errors, setErrors] = useState<Dictionary<string | undefined>>({});
    const [builder, setBuilder] = useState<TrainingModuleBuilder>(editBuilder ?? defaultBuilder);

    const onChangeField = useCallback(
        (field: keyof TrainingModuleBuilder) => {
            return (event: React.ChangeEvent<{ value: unknown }>) => {
                setBuilder(builder => {
                    return { ...builder, [field]: event.target.value as string };
                });
                setErrors(errors => ({
                    ...errors,
                    [field]: !event.target.value ? i18n.t("Field must have a value") : undefined,
                }));
            };
        },
        [setBuilder]
    );

    const onSave = useCallback(async () => {
        const errors = _.reduce(
            builder,
            (acc, value, key) => {
                if (!value) return { ...acc, [key]: i18n.t("Field must have a value") };
                return acc;
            },
            {} as Dictionary<string>
        );

        if (_.values(errors).length > 0) {
            setErrors(oldErrors => ({ ...oldErrors, ...errors }));
            return;
        }

        if (editBuilder) {
            await usecases.modules.edit(builder);
            onClose();
        } else {
            const result = await usecases.modules.create(builder);
            result.match({
                success: onClose,
                error: () => {
                    setErrors({ id: i18n.t("Code must be unique") });
                },
            });
        }
    }, [onClose, editBuilder, builder, usecases]);

    return (
        <ConfirmationDialog
            title={editBuilder ? i18n.t("Edit module") : i18n.t("Add module")}
            isOpen={true}
            maxWidth={"lg"}
            fullWidth={true}
            onCancel={onClose}
            onSave={onSave}
        >
            <Row>
                <TextField
                    disabled={!!editBuilder}
                    fullWidth={true}
                    label={"Code *"}
                    value={builder.id}
                    onChange={onChangeField("id")}
                    error={!!errors["id"]}
                    helperText={errors["id"]}
                />
            </Row>

            <Row>
                <TextField
                    disabled={!!editBuilder}
                    fullWidth={true}
                    label={"Name *"}
                    value={builder.name}
                    onChange={onChangeField("name")}
                    error={!!errors["name"]}
                    helperText={errors["name"]}
                />
            </Row>

            <Row>
                <TextField
                    fullWidth={true}
                    label={"PoEditor Project id *"}
                    value={builder.poEditorProject}
                    onChange={onChangeField("poEditorProject")}
                />
            </Row>
        </ConfirmationDialog>
    );
};

const Row = styled.div`
    margin-bottom: 25px;
`;
