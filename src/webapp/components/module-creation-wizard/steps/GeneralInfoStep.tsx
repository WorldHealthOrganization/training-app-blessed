import i18n from "@eyeseetea/d2-ui-components/locales";
import { TextField } from "@material-ui/core";
import { Dictionary } from "lodash";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { TrainingModuleBuilder } from "../../../../domain/entities/TrainingModule";
import { ModuleCreationWizardStepProps } from "./index";

export const GeneralInfoStep: React.FC<ModuleCreationWizardStepProps> = ({ module, onChange, isEdit }) => {
    const [errors, setErrors] = useState<Dictionary<string | undefined>>({});

    const onChangeField = useCallback(
        (field: keyof TrainingModuleBuilder) => {
            return (event: React.ChangeEvent<{ value: unknown }>) => {
                onChange(module => {
                    return { ...module, [field]: event.target.value as string };
                });
                setErrors(errors => ({
                    ...errors,
                    // TODO: Add validation from model
                    [field]: !event.target.value ? i18n.t("Field must have a value") : undefined,
                }));
            };
        },
        [onChange]
    );

    return (
        <React.Fragment>
            <Row>
                <TextField
                    disabled={!!isEdit}
                    fullWidth={true}
                    label={"Code *"}
                    value={module.id}
                    onChange={onChangeField("id")}
                    error={!!errors["id"]}
                    helperText={errors["id"]}
                />
            </Row>

            <Row>
                <TextField
                    disabled={!!isEdit}
                    fullWidth={true}
                    label={"Name *"}
                    value={module.name}
                    onChange={onChangeField("name")}
                    error={!!errors["name"]}
                    helperText={errors["name"]}
                />
            </Row>

            <Row>
                <TextField
                    fullWidth={true}
                    label={"PoEditor Project id *"}
                    value={module.translation.project}
                    onChange={onChangeField("poEditorProject")}
                />
            </Row>
        </React.Fragment>
    );
};

const Row = styled.div`
    margin-bottom: 25px;
`;
