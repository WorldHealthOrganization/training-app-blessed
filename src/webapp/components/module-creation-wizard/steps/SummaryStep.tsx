import { Button } from "@material-ui/core";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import i18n from "../../../../locales";
import { useAppContext } from "../../../contexts/app-context";
import { ModalBody } from "../../modal";
import { TrainingWizard } from "../../training-wizard/TrainingWizard";
import { ModuleCreationWizardStepProps } from "./index";

export const SummaryStep: React.FC<ModuleCreationWizardStepProps> = ({ module, onClose, onSave }) => {
    const { translate } = useAppContext();

    const [stepKey, setStepKey] = useState<string>(`${module.id}-1-1`);

    const saveModule = useCallback(async () => {
        await onSave();
        onClose();
    }, [onClose, onSave]);

    const movePage = useCallback(
        (step: number, content: number) => setStepKey(`${module.id}-${step}-${content}`),
        [setStepKey, module]
    );

    return (
        <Container>
            <Summary>
                <ul>
                    <LiEntry label={i18n.t("Identifier")} value={module.id} />

                    <LiEntry label={i18n.t("Name")} value={module.name.referenceValue} />
                </ul>

                <Button onClick={saveModule} variant="contained">
                    {i18n.t("Save")}
                </Button>
            </Summary>

            <StyledModalBody>
                <TrainingWizard translate={translate} module={module} currentStep={stepKey} onChangeStep={movePage} />
            </StyledModalBody>
        </Container>
    );
};

const LiEntry: React.FC<{ label: string; value?: string }> = ({ label, value, children }) => {
    return (
        <li key={label}>
            {label}
            {value || children ? ": " : ""}
            {value}
            {children}
        </li>
    );
};

const StyledModalBody = styled(ModalBody)`
    width: 600px;
    margin: 25px;
`;

const Container = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Summary = styled.div`
    padding: 10px;
`;
