import {
    ConfirmationDialog,
    ConfirmationDialogProps,
    ObjectsTable,
    TableAction,
    TableColumn,
    TableSelection,
    TableState,
    useLoading,
    useSnackbar,
} from "@eyeseetea/d2-ui-components";
import { Icon } from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import _ from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { TrainingModule, TrainingModuleStep } from "../../../domain/entities/TrainingModule";
import i18n from "../../../locales";
import { FlattenUnion } from "../../../utils/flatten-union";
import { useAppContext } from "../../contexts/app-context";
import { AlertIcon } from "../alert-icon/AlertIcon";
import { MarkdownEditorDialog, MarkdownEditorDialogProps } from "../markdown-editor/MarkdownEditorDialog";
import { MarkdownViewer } from "../markdown-viewer/MarkdownViewer";
import { ModalBody } from "../modal";

export interface ModuleListTableProps {
    rows: ListItem[];
    refreshRows?: () => Promise<void>;
}

export const ModuleListTable: React.FC<ModuleListTableProps> = ({ rows, refreshRows = async () => {} }) => {
    const { usecases, setAppState } = useAppContext();
    const loading = useLoading();
    const snackbar = useSnackbar();

    const [selection, setSelection] = useState<TableSelection[]>([]);
    const [dialogProps, updateDialog] = useState<ConfirmationDialogProps | null>(null);
    const [editContentsDialogProps, updateEditContentsDialog] = useState<MarkdownEditorDialogProps | null>(null);

    const deleteModules = useCallback(
        async (ids: string[]) => {
            updateDialog({
                title: i18n.t("Are you sure you want to delete the selected modules?"),
                description: i18n.t("This action cannot be reversed"),
                onCancel: () => {
                    updateDialog(null);
                },
                onSave: async () => {
                    updateDialog(null);
                    loading.show(true, i18n.t("Deleting modules"));
                    await usecases.modules.delete(ids);
                    await refreshRows();
                    snackbar.success("Successfully deleted modules");
                    loading.reset();
                    setSelection([]);
                },
                cancelText: i18n.t("Cancel"),
                saveText: i18n.t("Delete modules"),
            });
        },
        [usecases]
    );

    const addModule = useCallback(() => setAppState({ type: "CREATE_MODULE" }), [rows]);

    const editModule = useCallback(
        (ids: string[]) => {
            if (!ids[0]) return;
            setAppState({ type: "EDIT_MODULE", module: ids[0] });
        },
        [rows]
    );

    const moveUpModule = useCallback(
        async (ids: string[]) => {
            const rowIndex = _.findIndex(rows, ({ id }) => id === ids[0]);
            if (rowIndex === -1 || rowIndex === 0) return;

            const { id: prevRowId } = rows[rowIndex - 1] ?? {};
            if (prevRowId && ids[0]) {
                await usecases.modules.swapOrder(ids[0], prevRowId);
            }

            await refreshRows();
        },
        [rows, usecases]
    );

    const moveDownModule = useCallback(
        async (ids: string[]) => {
            const rowIndex = _.findIndex(rows, ({ id }) => id === ids[0]);
            if (rowIndex === -1 || rowIndex === rows.length - 1) return;

            const { id: nextRowId } = rows[rowIndex + 1] ?? {};
            if (nextRowId && ids[0]) {
                await usecases.modules.swapOrder(nextRowId, ids[0]);
            }

            await refreshRows();
        },
        [rows, usecases]
    );

    const editContents = useCallback(
        (ids: string[]) => {
            const row = buildChildrenRows(rows).find(({ id }) => id === ids[0]);
            if (!row) return;

            updateEditContentsDialog({
                title: i18n.t("Edit contents of {{name}}", row),
                initialValue: row.value ?? "",
                onCancel: () => updateEditContentsDialog(null),
                onSave: () => {
                    // TODO
                    updateEditContentsDialog(null);
                },
                onUpload: (data: ArrayBuffer) => usecases.instance.uploadFile(data),
                markdownPreview: markdown => <StepPreview value={markdown} />,
            });
        },
        [rows, usecases]
    );

    const installApp = useCallback(
        async (ids: string[]) => {
            if (!ids[0]) return;

            loading.show(true, i18n.t("Installing application"));
            const installed = await usecases.instance.installApp(ids[0]);
            loading.reset();

            if (!installed) {
                snackbar.error("Error installing app");
                return;
            }

            snackbar.success("Successfully installed app");
            await refreshRows();
        },
        [rows, snackbar, usecases]
    );

    const resetToFactorySettings = useCallback(
        async (row: ListItem) => {
            updateDialog(null);
            loading.show(true, i18n.t(`Resetting ${row.name} to factory settings`));
            await usecases.modules.resetToFactorySettings(row.dhisAppKey);
            snackbar.success(`Successfully resetted ${row.name} to factory settings`);
            loading.reset();
            await refreshRows();
        },
        [rows]
    );
    const showFactorySettingsConfirmationDialog = (ids: string[]) => {
        const row = buildChildrenRows(rows).find(({ id }) => id === ids[0]);
        if (!row) return;
        updateDialog({
            title: `Are you sure you want to reset ${row.name} to its factory settings? This action cannot be reversed.`,
            onCancel: () => {
                updateDialog(null);
            },
            onSave: () => resetToFactorySettings(row),
            cancelText: i18n.t("Cancel"),
            saveText: i18n.t("Reset app to factory settings"),
        });
    };

    const publishTranslations = useCallback(
        async (ids: string[]) => {
            if (!ids[0]) return;

            loading.show(true, i18n.t("Initialize project in POEditor"));
            await usecases.translations.publishTerms(ids[0]);
            loading.reset();
        },
        [usecases, loading]
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
                getValue: item => (
                    <div>
                        {item.name}
                        {!item.installed && item.rowType === "module" ? (
                            <AlertIcon tooltip={i18n.t("App is not installed in this instance")} />
                        ) : null}
                    </div>
                ),
            },
            {
                name: "id",
                text: "Code",
                hidden: true,
                sortable: false,
            },
            {
                name: "value",
                text: "Preview",
                sortable: false,
                getValue: item => {
                    return item.value && <StepPreview value={item.value} />;
                },
            },
        ],
        []
    );

    const actions: TableAction<ListItem>[] = useMemo(
        () => [
            {
                name: "new-module",
                text: i18n.t("Add module"),
                icon: <Icon>add</Icon>,
                onClick: addModule,
                isActive: rows => {
                    return _.every(rows, item => item.rowType === "module");
                },
            },
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
                name: "push-translations",
                text: i18n.t("Push local translations to POEditor"),
                icon: <Icon>publish</Icon>,
                onClick: publishTranslations,
                isActive: rows => {
                    return isDebug && _.every(rows, item => item.rowType === "module");
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
                    return _.every(rows, ({ position }) => position !== 0);
                },
            },
            {
                name: "move-down-module",
                text: i18n.t("Move down"),
                icon: <Icon>arrow_downwards</Icon>,
                onClick: moveDownModule,
                isActive: rows => {
                    return _.every(rows, ({ position, lastPosition }) => position !== lastPosition);
                },
            },
            {
                name: "edit-contents",
                text: i18n.t("Edit contents"),
                icon: <Icon>edit</Icon>,
                onClick: editContents,
                isActive: rows => {
                    return _.every(rows, item => item.rowType === "page");
                },
            },
            {
                name: "install-app",
                text: i18n.t("Install app"),
                icon: <GetAppIcon />,
                onClick: installApp,
                isActive: rows => {
                    return _.every(rows, item => item.rowType === "module" && !item.installed);
                },
            },
            {
                name: "reset-factory-settings",
                text: i18n.t("Restore to factory settings"),
                icon: <Icon>rotate_left</Icon>,
                onClick: showFactorySettingsConfirmationDialog,
                isActive: rows => {
                    return _.every(rows, item => item.rowType === "module");
                },
            },
        ],
        [
            rows,
            editModule,
            deleteModules,
            moveUpModule,
            moveDownModule,
            editContents,
            installApp,
            publishTranslations,
            resetToFactorySettings,
        ]
    );

    return (
        <PageWrapper>
            {editContentsDialogProps && <MarkdownEditorDialog {...editContentsDialogProps} />}
            {dialogProps && <ConfirmationDialog isOpen={true} maxWidth={"xl"} {...dialogProps} />}

            <ObjectsTable<ListItem>
                rows={rows}
                columns={columns}
                actions={actions}
                selection={selection}
                onChange={onTableChange}
                childrenKeys={["steps", "welcome", "pages"]}
                sorting={{ field: "position", order: "asc" }}
            />
        </PageWrapper>
    );
};

export type ListItem = FlattenUnion<ListItemModule | ListItemStep | ListItemPage>;

export interface ListItemModule extends Omit<TrainingModule, "name"> {
    name: string;
    rowType: "module";
    steps: ListItemStep[];
    position: number;
    lastPosition: number;
}

export interface ListItemStep {
    id: string;
    name: string;
    rowType: "step";
    pages: ListItemPage[];
    position: number;
    lastPosition: number;
}

export interface ListItemPage {
    id: string;
    name: string;
    rowType: "page";
    value: string;
    position: number;
    lastPosition: number;
}

export const buildListModules = (modules: TrainingModule[]): ListItemModule[] => {
    return modules.map((module, moduleIdx) => ({
        ...module,
        name: module.name.referenceValue,
        rowType: "module",
        position: moduleIdx,
        lastPosition: modules.length - 1,
        steps: buildListSteps(module.contents.steps),
    }));
};

export const buildListSteps = (steps: TrainingModuleStep[]): ListItemStep[] => {
    return steps.map(({ title, pages }, stepIdx) => ({
        id: `${module.id}-step-${stepIdx}`,
        name: `Step ${stepIdx + 1}: ${title.referenceValue}`,
        rowType: "step",
        position: stepIdx,
        lastPosition: steps.length - 1,
        pages: pages.map((value, pageIdx) => ({
            id: `${module.id}-page-${stepIdx}-${pageIdx}`,
            name: `Page ${pageIdx + 1}`,
            rowType: "page",
            position: pageIdx,
            lastPosition: pages.length - 1,
            value: value.referenceValue,
        })),
    }));
};

const buildChildrenRows = (items: ListItem[]): ListItem[] => {
    const steps = _.flatMap(items, item => item.steps);
    const pages = _.flatMap(steps, step => step?.pages);
    return _.compact([...items, ...steps, ...pages]);
};

export const StepPreview: React.FC<{
    className?: string;
    value?: string;
}> = ({ className, value }) => {
    if (!value) return null;

    return (
        <StyledModalBody className={className}>
            <MarkdownViewer source={value} />
        </StyledModalBody>
    );
};

const StyledModalBody = styled(ModalBody)`
    max-width: 600px;
`;

const PageWrapper = styled.div`
    .MuiTableRow-root {
        background: white;
    }
`;

const isDebug = process.env.NODE_ENV === "development";
