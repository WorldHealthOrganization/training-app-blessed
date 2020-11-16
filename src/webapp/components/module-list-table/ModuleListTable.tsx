import { Icon, IconButton, Tooltip } from "@material-ui/core";
import {
    ObjectsTable,
    TableAction,
    TableColumn,
    TableSelection,
    TableState,
} from "d2-ui-components";
import _ from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { NamedRef } from "../../../domain/entities/Ref";
import { TrainingModule, TrainingModuleBuilder } from "../../../domain/entities/TrainingModule";
import i18n from "../../../locales";
import { FlattenUnion } from "../../../utils/flatten-union";
import { useAppContext } from "../../contexts/app-context";
import { MarkdownViewer } from "../markdown-viewer/MarkdownViewer";
import { ModalBody } from "../modal";
import { ModuleCreationDialog } from "../module-creation-dialog/ModuleCreationDialog";

export const ModuleListTable: React.FC = () => {
    const { usecases } = useAppContext();

    const [loading, setLoading] = useState<boolean>(true);
    const [modules, setModules] = useState<ListItemModule[]>([]);
    const [selection, setSelection] = useState<TableSelection[]>([]);

    const [editModuleCreationDialog, setEditModuleCreationDialog] = useState<
        TrainingModuleBuilder
    >();
    const [isCreationDialogOpen, setOpenCreationDialog] = useState<boolean>(false);
    const [refreshKey, setRefreshKey] = useState(Math.random());

    const closeCreationDialog = useCallback(() => {
        setOpenCreationDialog(false);
        setEditModuleCreationDialog(undefined);
        setRefreshKey(Math.random());
    }, []);

    const deleteModules = useCallback(
        async (ids: string[]) => {
            setLoading(true);
            await usecases.modules.delete(ids);
            setRefreshKey(Math.random());
            setLoading(false);
            setSelection([]);
        },
        [usecases]
    );

    const addModule = useCallback(() => {
        setEditModuleCreationDialog(undefined);
        setOpenCreationDialog(true);
    }, []);

    const editModule = useCallback(
        (ids: string[]) => {
            const row = modules.find(({ id }) => id === ids[0]);
            if (row) {
                setEditModuleCreationDialog({
                    id: row.id,
                    name: row.name,
                    title: row.contents.welcome.title,
                    description: row.contents.welcome.description,
                });
                setOpenCreationDialog(true);
            }
        },
        [modules]
    );

    const moveUpModule = useCallback(
        async (ids: string[]) => {
            const rowIndex = _.findIndex(modules, ({ id }) => id === ids[0]);
            if (rowIndex === -1 || rowIndex === 0) return;

            const prevRow = modules[rowIndex - 1];
            await usecases.modules.swapOrder(ids[0], prevRow.id);
            setRefreshKey(Math.random());
        },
        [modules, usecases]
    );

    const moveDownModule = useCallback(
        async (ids: string[]) => {
            const rowIndex = _.findIndex(modules, ({ id }) => id === ids[0]);
            if (rowIndex === -1 || rowIndex === modules.length - 1) return;

            const nextRow = modules[rowIndex + 1];
            await usecases.modules.swapOrder(nextRow.id, ids[0]);
            setRefreshKey(Math.random());
        },
        [modules, usecases]
    );

    const onTableChange = useCallback(({ selection }: TableState<ListItem>) => {
        setSelection(selection);
    }, []);

    const columns: TableColumn<ListItem>[] = useMemo(
        () => [
            {
                name: "name",
                text: "Name",
                sortable: false,
            },
            {
                name: "id",
                text: "Code",
                hidden: true,
                sortable: false,
            },
            {
                name: "disabled",
                text: "Disabled",
                sortable: false,
                getValue: item => {
                    return item.disabled ? i18n.t("Yes") : i18n.t("No");
                },
            },
            {
                name: "value",
                text: "Preview",
                sortable: false,
                getValue: item => {
                    return item.rowType !== "step" && <StyledStepPreview value={item.value} />;
                },
            },
        ],
        []
    );

    const actions: TableAction<ListItem>[] = useMemo(
        () => [
            {
                name: "edit-module",
                text: i18n.t("Edit module"),
                icon: <Icon>edit</Icon>,
                onClick: editModule,
                isActive: rows => {
                    return _.every(rows, item => item.rowType === "module");
                },
            },
            {
                name: "delete-module",
                text: i18n.t("Delete module"),
                icon: <Icon>delete</Icon>,
                multiple: true,
                onClick: deleteModules,
                isActive: rows => {
                    return _.every(rows, item => item.rowType === "module" && item.type !== "core");
                },
            },
            {
                name: "move-up-module",
                text: i18n.t("Move up"),
                icon: <Icon>arrow_upwards</Icon>,
                onClick: moveUpModule,
                isActive: rows => {
                    return _.every(rows, item => item.rowType === "module" && item.position !== 0);
                },
            },
            {
                name: "move-down-module",
                text: i18n.t("Move down"),
                icon: <Icon>arrow_downwards</Icon>,
                onClick: moveDownModule,
                isActive: rows => {
                    return _.every(
                        rows,
                        item => item.rowType === "module" && item.position !== modules.length - 1
                    );
                },
            },
        ],
        [modules, editModule, deleteModules, moveUpModule, moveDownModule]
    );

    useEffect(() => {
        usecases.modules.list().then(modules => {
            setModules(buildListItems(modules));
            setLoading(false);
        });
    }, [usecases, refreshKey]);

    return (
        <PageWrapper>
            {isCreationDialogOpen && (
                <ModuleCreationDialog
                    onClose={closeCreationDialog}
                    builder={editModuleCreationDialog}
                />
            )}

            <ObjectsTable<ListItem>
                loading={loading}
                rows={modules}
                columns={columns}
                actions={actions}
                selection={selection}
                onChange={onTableChange}
                childrenKeys={["steps", "pages"]}
                forceSelectionColumn={true}
                sorting={{ field: "position", order: "asc" }}
                filterComponents={
                    <Tooltip title={"New module"} placement={"right"}>
                        <IconButton onClick={addModule}>
                            <Icon>add_box</Icon>
                        </IconButton>
                    </Tooltip>
                }
            />
        </PageWrapper>
    );
};

type ListItem = FlattenUnion<ListItemModule | ListItemStep | ListItemPage>;

interface ListItemModule extends TrainingModule {
    rowType: "module";
    steps: ListItemStep[];
    value: string;
    position: number;
}

interface ListItemStep {
    id: string;
    name: string;
    rowType: "step";
    pages: ListItemPage[];
    position: number;
}

interface ListItemPage extends NamedRef {
    rowType: "page";
    value: string;
    position: number;
}

const buildListItems = (modules: TrainingModule[]): ListItemModule[] => {
    return modules.map((module, moduleIdx) => ({
        ...module,
        rowType: "module",
        position: moduleIdx,
        value: `# ${module.contents.welcome.title}\n\n${module.contents.welcome.description}`,
        steps: module.contents.steps.map(({ title, pages }, stepIdx) => ({
            id: `step-${stepIdx + 1}`,
            name: `Step ${stepIdx + 1}: ${title}`,
            rowType: "step",
            position: stepIdx,
            pages: pages.map((value, pageIdx) => ({
                id: `page-${stepIdx + 1}-${stepIdx + 1}`,
                name: `Page ${pageIdx + 1}`,
                rowType: "page",
                position: pageIdx,
                value,
            })),
        })),
    }));
};

const StepPreview: React.FC<{ className?: string; value?: string }> = ({ className, value }) => {
    if (!value) return null;

    return (
        <ModalBody className={className}>
            <MarkdownViewer source={value} escapeHtml={false} />
        </ModalBody>
    );
};

const StyledStepPreview = styled(StepPreview)`
    max-width: 600px;

    h1,
    p {
        text-align: center;
    }
`;

const PageWrapper = styled.div`
    .MuiTableRow-root {
        background: white;
    }
`;
