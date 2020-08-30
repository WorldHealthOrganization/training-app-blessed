import { Paper } from "material-ui";
import React from "react";
import Draggable from "react-draggable";
import styled from "styled-components";
import { Wizard, WizardStep } from "../wizard/Wizard";

export interface DraggableDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export const DraggableDialog: React.FC<DraggableDialogProps> = ({ open }) => {
    if (!open) return null;

    const onStepChangeRequest = async (_currentStep: WizardStep, _newStep: WizardStep) => {
        return undefined;
    };

    return (
        <Draggable handle="#draggable-dialog-title">
            <Paper style={{ width: 500 }}>
                <StyledWizard
                    useSnackFeedback={true}
                    onStepChangeRequest={onStepChangeRequest}
                    initialStepKey={"general-info"}
                    steps={[
                        {
                            key: "general-info",
                            label: "General info",
                            component: GeneralInfoStep,
                        },
                        {
                            key: "general-info2",
                            label: "General info",
                            component: GeneralInfoStep,
                        },
                    ]}
                />
            </Paper>
        </Draggable>
    );
};

const StyledWizard = styled(Wizard)`
    .MuiStepConnector-root {
        display: none;
    }

    .MuiStepLabel-labelContainer {
        display: none;
    }

    .MuiStepLabel-iconContainer > svg {
        font-weight: 700;
        border: 0px;
        background-color: #fff;
        padding: 5px;
        border-radius: 100px;
        height: 20px;
        width: 20px;
        color: #276696;
        display: inline-block;
        line-height: 20px;
        color: #276696;
        background-color: #43cbcb;
    }

    circle {
        display: none;
    }

    .MuiStepLabel-iconContainer::after {
        content: "";
        position: absolute;
        top: 50%;
        height: 3px;
        width: calc(100% - 21px);
        background-color: #43cbcb;
        margin-left: 10px;
    }

    .Wizard-Stepper > button {
        font-size: 18px;
        color: #fff;
        margin: 0px 20px;
        padding: 15px 36px;
        border-radius: 100px;
        border: 0px;
        background-color: #43cbcb;
    }
`;

const GeneralInfoStep = () => {
    return (
        <React.Fragment>
            <p>This is a step</p>
        </React.Fragment>
    );
};
