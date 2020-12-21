import React, { useCallback } from "react";
import { TrainingWizard } from "../../components/training-wizard/TrainingWizard";
import { useAppContext } from "../../contexts/app-context";

export const TutorialPage = () => {
    const { appState, setAppState, module } = useAppContext();

    const exitTutorial = useCallback(() => {
        setAppState(appState => ({ ...appState, exit: true }));
    }, [setAppState]);

    if (appState.type !== "TRAINING") return null;

    return <TrainingWizard onClose={exitTutorial} module={module} />;
};
