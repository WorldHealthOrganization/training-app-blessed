import React, { useCallback, useMemo } from "react";
import { TrainingWizardModal } from "../../components/training-wizard/TrainingWizardModal";
import { useAppContext } from "../../contexts/app-context";

export const TutorialPage = () => {
    const { appState, setAppState, module, usecases, translate } = useAppContext();

    const minimized = useMemo(() => appState.type === "TRAINING" && appState.state === "MINIMIZED", [appState]);

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
            } else if (module && step > module.contents.steps.length) {
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
        [setAppState, module]
    );

    const stepKey = useMemo(() => {
        if (appState.type !== "TRAINING" || !module) return undefined;
        return `${module.id}-${appState.step}-${appState.content}`;
    }, [appState, module]);

    if (appState.type !== "TRAINING" || !stepKey || !module) return null;

    return (
        <TrainingWizardModal
            translate={translate}
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
