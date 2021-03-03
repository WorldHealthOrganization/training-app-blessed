import { ObjectsTable, TableAction, TableColumn } from "@eyeseetea/d2-ui-components";
import { Icon } from "@material-ui/core";
import React, { useMemo } from "react";
import { LandingNode, LandingNodeType } from "../../../domain/entities/LandingPage";
import i18n from "../../../locales";
import { useAppContext } from "../../contexts/app-context";

export const LandingPageListTable: React.FC<{ nodes: LandingNode[] }> = ({ nodes }) => {
    const { usecases, reload } = useAppContext();

    const columns: TableColumn<LandingNode>[] = useMemo(
        () => [
            {
                name: "type",
                text: "Type",
                sortable: false,
                getValue: item => getTypeName(item.type),
            },
            {
                name: "name",
                text: "Name",
                getValue: item => item.name.referenceValue,
            },
        ],
        []
    );

    const actions: TableAction<LandingNode>[] = useMemo(
        () => [
            {
                name: "remove",
                text: i18n.t("Delete"),
                icon: <Icon>delete</Icon>,
                onClick: async ids => {
                    await usecases.landings.delete(ids);
                    await reload();
                },
            },
        ],
        [usecases, reload]
    );

    return (
        <ObjectsTable<LandingNode>
            rows={nodes}
            columns={columns}
            actions={actions}
            forceSelectionColumn={true}
            childrenKeys={["children"]}
        />
    );
};

const getTypeName = (type: LandingNodeType) => {
    switch (type) {
        case "page":
            return i18n.t("Section");
        case "page-group":
            return i18n.t("Sub-section");
        case "module-group":
            return i18n.t("Category");
        case "module":
            return i18n.t("Training module");
        default:
            return "-";
    }
};
