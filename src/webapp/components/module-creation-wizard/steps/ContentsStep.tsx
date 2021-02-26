import React, { useMemo } from "react";
import { ComponentParameter } from "../../../../types/utils";
import { useAppContext } from "../../../contexts/app-context";
import { buildListSteps, ModuleListTable } from "../../module-list-table/ModuleListTable";
import { ModuleCreationWizardStepProps } from "./index";

export const ContentsStep: React.FC<ModuleCreationWizardStepProps> = ({ module }) => {
    const { usecases } = useAppContext();

    const tableActions: ComponentParameter<typeof ModuleListTable, "tableActions"> = useMemo(
        () => ({
            uploadFile: ({ data }) => usecases.instance.uploadFile(data),
        }),
        [usecases]
    );

    return (
        <React.Fragment>
            <ModuleListTable rows={buildListSteps(module.id, module.contents.steps)} tableActions={tableActions} />
        </React.Fragment>
    );
};
