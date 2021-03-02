import { ObjectsTable, TableColumn } from "@eyeseetea/d2-ui-components";
import React, { useMemo } from "react";
import { LandingNode, LandingNodeType } from "../../../domain/entities/LandingPage";
import i18n from "../../../locales";

export const LandingPageListTable: React.FC<{ nodes: LandingNode[] }> = ({ nodes }) => {
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

    return (
        <ObjectsTable<LandingNode>
            rows={nodes}
            columns={columns}
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
