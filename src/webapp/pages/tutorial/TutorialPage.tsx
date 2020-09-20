import React, { useCallback } from "react";
import { ActionButton } from "../../components/action-button/ActionButton";
import { TrainingWizard } from "../../components/training-wizard/TrainingWizard";
import { useAppContext } from "../../contexts/app-context";

export const TutorialPage = () => {
    const { appState, setAppState, module } = useAppContext();

    const onClose = useCallback(() => {
        setAppState(appState => {
            if (appState.type !== "TRAINING") return appState;
            return { ...appState, state: "CLOSED" };
        });
    }, [setAppState]);

    const toggleClose = useCallback(() => {
        setAppState(appState => {
            if (appState.type !== "TRAINING") return appState;
            const state = appState.state === "CLOSED" ? "OPEN" : "CLOSED";
            return { ...appState, state };
        });
    }, [setAppState]);

    if (appState.type !== "TRAINING") return null;

    return appState.state === "CLOSED" ? (
        <ActionButton onClick={toggleClose} />
    ) : (
        <TrainingWizard onClose={onClose} module={module} />
    );
};
