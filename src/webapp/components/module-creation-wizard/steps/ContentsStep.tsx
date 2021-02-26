import React, { useMemo } from "react";
import { ComponentParameter } from "../../../../types/utils";
import { useAppContext } from "../../../contexts/app-context";
import { buildListSteps, ModuleListTable } from "../../module-list-table/ModuleListTable";
import { ModuleCreationWizardStepProps } from "./index";

export const ContentsStep: React.FC<ModuleCreationWizardStepProps> = ({ module }) => {
    // TODO: Remove from component
    const { setAppState, usecases } = useAppContext();

    const tableActions: ComponentParameter<typeof ModuleListTable, "tableActions"> = useMemo(
        () => ({
            editModule: ({ id }) => {
                setAppState({ type: "EDIT_MODULE", module: id });
            },
            createModule: () => {
                setAppState({ type: "CREATE_MODULE" });
            },
            deleteModules: ({ ids }) => usecases.modules.delete(ids),
            resetModules: ({ ids }) => usecases.modules.resetDefaultValue(ids),
            swap: ({ from, to }) => usecases.modules.swapOrder(from, to),
            publishTranslations: ({ id }) => usecases.translations.publishTerms(id),
            uploadFile: ({ data }) => usecases.instance.uploadFile(data),
            installApp: ({ id }) => usecases.instance.installApp(id),
        }),
        [usecases, setAppState]
    );

    return (
        <React.Fragment>
            <ModuleListTable rows={buildListSteps(module.id, module.contents.steps)} tableActions={tableActions} />
        </React.Fragment>
    );
};
