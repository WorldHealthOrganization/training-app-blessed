import React, { useCallback, useEffect, useState } from "react";
import { TrainingModule } from "../../../domain/entities/TrainingModule";
import { ActionButton } from "../../components/action-button/ActionButton";
import { TrainingWizard } from "../../components/training-wizard/TrainingWizard";
import { useAppContext } from "../../contexts/app-context";

export const TutorialPage = () => {
    const { usecases, appState, setAppState } = useAppContext();

    const [module, setModule] = useState<TrainingModule>();

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

    useEffect(() => {
        usecases.getModule().then(setModule);
    }, [usecases]);

    if (appState.type !== "TRAINING") return null;

    return appState.state === "CLOSED" ? (
        <ActionButton onClick={toggleClose} />
    ) : (
        <TrainingWizard onClose={onClose} module={module} />
    );
};
