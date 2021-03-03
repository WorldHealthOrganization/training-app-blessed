import { ObjectsTable, TableAction, TableColumn } from "@eyeseetea/d2-ui-components";
import { Icon } from "@material-ui/core";
import _ from "lodash";
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { LandingNode, LandingNodeType } from "../../../domain/entities/LandingPage";
import i18n from "../../../locales";
import { useAppContext } from "../../contexts/app-context";
import { LandingPageEditDialog, LandingPageEditDialogProps } from "../landing-page-edit-dialog/LandingPageEditDialog";

export const LandingPageListTable: React.FC<{ nodes: LandingNode[] }> = ({ nodes }) => {
    const { usecases, reload } = useAppContext();

    const [editDialogProps, updateEditDialog] = useState<LandingPageEditDialogProps | null>(null);

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
            {
                name: "title",
                text: "Title",
                getValue: item => item.title?.referenceValue ?? "-",
            },
            {
                name: "description",
                text: "Description",
                getValue: item => item.description?.referenceValue ?? "-",
            },
            {
                name: "icon",
                text: "Icon",
                getValue: item => (item.icon ? <ItemIcon src={item.icon} alt={`Icon for ${item.name}`} /> : "-"),
            },
        ],
        []
    );

    const actions: TableAction<LandingNode>[] = useMemo(
        () => [
            {
                name: "add-page-group",
                text: i18n.t("Add sub-section"),
                icon: <Icon>playlist_add</Icon>,
                onClick: ids => {
                    const parent = ids[0];
                    if (!parent) return;

                    updateEditDialog({
                        title: i18n.t("Add"),
                        type: "page-group",
                        parent,
                        onCancel: () => updateEditDialog(null),
                        onSave: async node => {
                            updateEditDialog(null);
                            await usecases.landings.update(node);
                            await reload();
                        },
                    });
                },
                isActive: nodes => _.every(nodes, item => item.type === "page"),
            },
            {
                name: "add-module-group",
                text: i18n.t("Add category"),
                icon: <Icon>queue</Icon>,
                onClick: ids => {
                    const parent = ids[0];
                    if (!parent) return;

                    updateEditDialog({
                        title: i18n.t("Add"),
                        type: "module-group",
                        parent,
                        onCancel: () => updateEditDialog(null),
                        onSave: async node => {
                            updateEditDialog(null);
                            await usecases.landings.update(node);
                            await reload();
                        },
                    });
                },
                isActive: nodes => _.every(nodes, item => item.type === "page"),
            },
            {
                name: "add-page",
                text: i18n.t("Add section"),
                icon: <Icon>add</Icon>,
                onClick: ids => {
                    const parent = ids[0];
                    if (!parent) return;

                    updateEditDialog({
                        title: i18n.t("Add"),
                        type: "page",
                        parent,
                        onCancel: () => updateEditDialog(null),
                        onSave: async node => {
                            updateEditDialog(null);
                            await usecases.landings.update(node);
                            await reload();
                        },
                    });
                },
                isActive: nodes => _.every(nodes, item => item.type === "page-group"),
            },
            {
                name: "add-module",
                text: i18n.t("Assign module"),
                icon: <Icon>add</Icon>,
                onClick: ids => {
                    const parent = ids[0];
                    if (!parent) return;

                    updateEditDialog({
                        title: i18n.t("Add"),
                        type: "module",
                        parent,
                        onCancel: () => updateEditDialog(null),
                        onSave: async node => {
                            updateEditDialog(null);
                            await usecases.landings.update(node);
                            await reload();
                        },
                    });
                },
                isActive: nodes => _.every(nodes, item => item.type === "module-group"),
            },
            {
                name: "edit",
                text: i18n.t("Edit"),
                icon: <Icon>edit</Icon>,
                onClick: ids => {
                    const node = flattenRows(nodes).find(({ id }) => id === ids[0]);
                    if (!node) return;

                    updateEditDialog({
                        title: i18n.t("Edit"),
                        type: node.type,
                        parent: node.parent,
                        initialNode: node,
                        onCancel: () => updateEditDialog(null),
                        onSave: async node => {
                            updateEditDialog(null);
                            await usecases.landings.update(node);
                            await reload();
                        },
                    });
                },
            },
            {
                name: "remove",
                text: i18n.t("Delete"),
                icon: <Icon>delete</Icon>,
                multiple: true,
                onClick: async ids => {
                    await usecases.landings.delete(ids);
                    await reload();
                },
                isActive: nodes => _.every(nodes, item => item.id !== "root"),
            },
        ],
        [usecases, reload, nodes]
    );

    return (
        <React.Fragment>
            {editDialogProps && <LandingPageEditDialog isOpen={true} {...editDialogProps} />}
            <ObjectsTable<LandingNode> rows={nodes} columns={columns} actions={actions} childrenKeys={["children"]} />
        </React.Fragment>
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

const flattenRows = (rows: LandingNode[]): LandingNode[] => {
    return _.flatMap(rows, row => [row, ...flattenRows(row.children)]);
};

const ItemIcon = styled.img`
    width: 100px;
`