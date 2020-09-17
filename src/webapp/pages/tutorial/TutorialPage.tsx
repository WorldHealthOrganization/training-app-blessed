import { useConfig } from "@dhis2/app-runtime";
import React, { useCallback, useState } from "react";
import { ActionButton } from "../../components/action-button/ActionButton";
import { IFrame } from "../../components/iframe/IFrame";
import { TrainingWizard } from "../../components/training-wizard/TrainingWizard";

export const TutorialPage = () => {
    const { baseUrl } = useConfig();

    const [open, setOpen] = useState(false);

    const onClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    return (
        <React.Fragment>
            <IFrame src={`${baseUrl}/dhis-web-dataentry/index.action`} />

            {open ? (
                <TrainingWizard onClose={onClose} />
            ) : (
                <ActionButton onClick={() => setOpen(!open)} />
            )}
        </React.Fragment>
    );
};
