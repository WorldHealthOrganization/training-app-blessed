import { IconButton, makeStyles, Theme, Tooltip } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Paper from "@material-ui/core/Paper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import Stepper from "@material-ui/core/Stepper";
import { DialogButton, useSnackbar } from "d2-ui-components";
import _ from "lodash";
//@ts-ignore
import memoize from "nano-memoize";
import { ReactComponentLike } from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import i18n from "../../../locales";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: "100%",
    },
    description: {
        marginBottom: 15,
        marginLeft: 3,
        fontSize: "1.1em",
    },
    warning: {
        marginBottom: 15,
        marginLeft: 3,
        fontSize: "1.1em",
        color: "#F00",
        textAlign: "center",
        backgroundColor: "#EEE",
        padding: 20,
    },
    button: {
        margin: theme.spacing(1),
        marginRight: 5,
        padding: 10,
    },
    buttonDisabled: {
        color: "grey !important",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "flex-end",
        paddingTop: 10,
    },
    stepButton: {
        width: "auto",
    },
    contents: {
        margin: 10,
        padding: 25,
    },
    messages: {
        padding: 0,
        listStyleType: "none",
        color: "red",
    },
    stepper: {
        marginLeft: 10,
        marginRight: 10,
    },
}));

export interface WizardStep {
    key: string;
    label: string;
    warning?: string;
    description?: string;
    component: ReactComponentLike;
    props?: object;
    help?: React.ReactNode;
    helpDialogIsInitialOpen?: boolean;
}

export interface WizardProps {
    className?: string;
    initialStepKey: string;
    onStepChangeRequest: (
        currentStep: WizardStep,
        newStep: WizardStep
    ) => Promise<string[] | undefined>;
    onStepChange?: (stepKey: string) => void;
    useSnackFeedback?: boolean;
    steps: WizardStep[];
    lastClickableStepIndex?: number;
}

export const Wizard: React.FC<WizardProps> = ({
    className,
    initialStepKey,
    onStepChangeRequest,
    onStepChange = _.noop,
    useSnackFeedback = false,
    steps,
    lastClickableStepIndex: initialLastClickableStepIndex = 0,
}) => {
    const classes = useStyles();
    const snackbar = useSnackbar();

    const [currentStepKey, setCurrentStepKey] = useState(initialStepKey);
    const [lastClickableStepIndex, setLastClickableStepIndex] = useState(
        initialLastClickableStepIndex
    );
    const [messages, setMessages] = useState<string[]>([]);

    const getAdjacentSteps = () => {
        const index = _(steps).findIndex(step => step.key === currentStepKey);
        const prevStepKey = index >= 1 ? steps[index - 1].key : null;
        const nextStepKey = index >= 0 && index < steps.length - 1 ? steps[index + 1].key : null;
        return { prevStepKey, nextStepKey };
    };

    const nextStep = () => {
        const { nextStepKey } = getAdjacentSteps();
        if (nextStepKey) setStep(nextStepKey);
    };

    const prevStep = () => {
        const { prevStepKey } = getAdjacentSteps();
        if (prevStepKey) setStep(prevStepKey);
    };

    const renderNavigationButton = ({ stepKey, onClick, label }: any) => {
        return (
            <Button
                variant="contained"
                classes={{ disabled: classes.buttonDisabled }}
                disabled={!stepKey}
                className={classes.button}
                onClick={onClick}
            >
                {label}
            </Button>
        );
    };

    const renderHelp = ({ step, currentStepKey }: any) => {
        return (
            <DialogButton
                buttonComponent={HelpButton}
                title={`${step.label} - ${i18n.t("Help")}`}
                contents={step.help}
                initialIsOpen={step.helpDialogIsInitialOpen}
                isVisible={step.help && step.key === currentStepKey}
            />
        );
    };

    const renderFeedbackMessages = () => {
        if (useSnackFeedback || messages.length === 0) {
            return null;
        } else {
            return (
                <div className="messages">
                    <ul className={classes.messages}>
                        {messages.map((message, index) => (
                            <li key={index}>{message}</li>
                        ))}
                    </ul>
                </div>
            );
        }
    };

    const notifyStepChange = useCallback(
        (skepKey: string) => {
            onStepChange(skepKey);
        },
        [onStepChange]
    );

    const setStep = async (newStepKey: string) => {
        const stepsByKey = _.keyBy(steps, "key");
        const newStep = stepsByKey[newStepKey];
        const currentStep = stepsByKey[currentStepKey];
        const currentStepIndex = _(steps).findIndex(step => step.key === currentStepKey);
        const newStepIndex = _(steps).findIndex(step => step.key === newStepKey);
        const shouldValidate = newStepIndex > currentStepIndex;
        const errorMessages = shouldValidate ? await onStepChangeRequest(currentStep, newStep) : [];

        if (_(errorMessages).isEmpty()) {
            const newLastClickableStepIndex = Math.max(lastClickableStepIndex, newStepIndex);
            notifyStepChange(newStepKey);
            setCurrentStepKey(newStepKey);
            setLastClickableStepIndex(newLastClickableStepIndex);
            setMessages([]);
        } else if (errorMessages) {
            if (useSnackFeedback) {
                snackbar.error(errorMessages.join("\n"), {
                    autoHideDuration: null,
                });
            } else {
                setMessages(errorMessages);
            }
        }
    };

    const onStepClicked = memoize((stepKey: string) => () => {
        setStep(stepKey);
    });

    const index = _(steps).findIndex(step => step.key === currentStepKey);
    const currentStepIndex = index >= 0 ? index : 0;
    const currentStep = steps[currentStepIndex];
    const { prevStepKey, nextStepKey } = getAdjacentSteps();
    const NavigationButton = renderNavigationButton;
    const Help = renderHelp;
    const FeedbackMessages = renderFeedbackMessages;
    const { component: StepComponent, props: stepProps = {}, warning, description } = currentStep;

    useEffect(() => {
        notifyStepChange(currentStepKey);
    }, [notifyStepChange, currentStepKey]);

    return (
        <div className={[className, classes.root].join(" ")}>
            {steps.length > 1 && (
                <Stepper nonLinear={true} activeStep={currentStepIndex} className={classes.stepper}>
                    {steps.map((step, index) => (
                        <Step
                            key={step.key}
                            completed={false}
                            disabled={index > lastClickableStepIndex}
                            className={"Wizard-Step"}
                        >
                            <StepButton
                                key={step.key}
                                data-test-current={currentStep === step}
                                onClick={onStepClicked(step.key)}
                                classes={{ root: classes.stepButton }}
                                className={currentStep === step ? "current-step" : ""}
                            >
                                {step.label}
                            </StepButton>

                            {step.help && <Help step={step} currentStepKey={currentStepKey} />}
                        </Step>
                    ))}
                </Stepper>
            )}

            <FeedbackMessages />

            <Paper className={classes.contents} data-wizard-contents={true}>
                {warning && <div className={classes.warning}>{warning}</div>}

                {description && <div className={classes.description}>{description}</div>}

                {<StepComponent {...stepProps} />}

                {steps.length > 1 && (
                    <div className={["Wizard-Stepper", classes.buttonContainer].join(" ")}>
                        <NavigationButton
                            stepKey={prevStepKey}
                            onClick={prevStep}
                            label={"← " + i18n.t("Previous")}
                        />

                        <NavigationButton
                            stepKey={nextStepKey}
                            onClick={nextStep}
                            label={i18n.t("Next") + " →"}
                        />
                    </div>
                )}
            </Paper>
        </div>
    );
};

const HelpButton = ({ onClick }: any) => (
    <Tooltip title={i18n.t("Help")}>
        <IconButton onClick={onClick}>
            <Icon color="primary">help</Icon>
        </IconButton>
    </Tooltip>
);

export default Wizard;
