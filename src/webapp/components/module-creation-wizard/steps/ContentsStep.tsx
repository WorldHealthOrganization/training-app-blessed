import React from "react";
import { ModuleListTable, buildListSteps } from "../../module-list-table/ModuleListTable";
import { ModuleCreationWizardStepProps } from "./index";

export const ContentsStep: React.FC<ModuleCreationWizardStepProps> = ({ module }) => {
    return (
        <React.Fragment>
            <ModuleListTable rows={buildListSteps(module.contents.steps)} />
        </React.Fragment>
    );
};
