import React, { useCallback, useEffect, useState } from "react";
import { TrainingModule } from "../../../domain/entities/TrainingModule";
import { ActionButton } from "../../components/action-button/ActionButton";
import { TrainingWizard } from "../../components/training-wizard/TrainingWizard";
import { useAppContext } from "../../contexts/app-context";

export const TutorialPage = () => {
    const { usecases } = useAppContext();

    const [open, setOpen] = useState(false);
    const [module, setModule] = useState<TrainingModule>();

    const onClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    useEffect(() => {
        usecases.getModule().then(setModule);
    }, [usecases]);

    return open ? (
        <TrainingWizard onClose={onClose} module={module} />
    ) : (
        <ActionButton onClick={() => setOpen(!open)} />
    );
};
