import _ from "lodash";
import React, { useCallback, useMemo } from "react";
import { MarkdownContentStep } from "../../components/training-wizard/steps/MarkdownContentStep";
import { TrainingWizard, TrainingWizardStepProps } from "../../components/training-wizard/TrainingWizard";
import { useAppContext } from "../../contexts/app-context";

export const TutorialPage = () => {
    const { appState, setAppState, module, usecases, translate } = useAppContext();

    const minimized = useMemo(() => appState.type === "TRAINING" && appState.state === "MINIMIZED", [appState]);

    const steps = useMemo(() => {
        if (!module) return [];
        return _.flatMap(module.contents.steps, ({ title, subtitle, pages }, step) =>
            pages.map((content, position) => {
                const props: TrainingWizardStepProps = {
                    title: translate(title),
                    subtitle: subtitle ? translate(subtitle) : undefined,
                    content: translate(content),
                    stepIndex: step,
                    contentIndex: position,
                    totalSteps: module.contents.steps.length,
                    totalContents: pages.length,
                    minimized,
                };

                return {
                    key: `${module.id}-${step + 1}-${position + 1}`,
                    module,
                    label: "Select your location",
                    component: MarkdownContentStep,
                    props,
                };
            })
        );
    }, [module, minimized, translate]);

    const exitTutorial = useCallback(() => {
        setAppState(appState => ({ ...appState, exit: true }));
    }, [setAppState]);

    const goHome = useCallback(() => {
        setAppState({ type: "HOME" });
    }, [setAppState]);

    const updateProgress = useCallback(
        (moduleId: string, progress: number) => usecases.progress.update(moduleId, progress),
        [usecases]
    );

    const minimize = useCallback(() => {
        setAppState(appState => {
            if (appState.type !== "TRAINING") return appState;
            const state = appState.state === "MINIMIZED" ? "OPEN" : "MINIMIZED";
            return { ...appState, state };
        });
    }, [setAppState]);

    const movePage = useCallback(
        (step: number, content: number) => {
            if (step === 0) {
                setAppState(appState => {
                    if (appState.type !== "TRAINING") return appState;
                    return { type: "TRAINING_DIALOG", dialog: "contents", module: appState.module };
                });
            } else if (step === steps.length - 1) {
                setAppState(appState => {
                    if (appState.type !== "TRAINING") return appState;
                    return { type: "TRAINING_DIALOG", dialog: "final", module: appState.module };
                });
            } else {
                setAppState(appState => {
                    if (appState.type !== "TRAINING") return appState;
                    return { ...appState, step, content };
                });
            }
        },
        [setAppState, steps]
    );

    const stepKey = useMemo(() => {
        if (appState.type !== "TRAINING" || !module) return undefined;
        const key = `${module.id}-${appState.step}-${appState.content}`;
        return steps.find(step => step.key === key) ? key : steps[0]?.key;
    }, [appState, module]);

    if (appState.type !== "TRAINING" || !stepKey) return null;

    return (
        <TrainingWizard
            steps={steps}
            module={module}
            onClose={exitTutorial}
            onGoHome={goHome}
            currentStep={stepKey}
            onChangeStep={movePage}
            minimized={minimized}
            onMinimize={minimize}
            updateProgress={updateProgress}
        />
    );
};
