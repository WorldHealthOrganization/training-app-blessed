import {
    //DatePicker,
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
import { FileRejection } from "react-dropzone";
import GetAppIcon from "@material-ui/icons/GetApp";
import _ from "lodash";
import React, { useCallback, useMemo, useState, useRef } from "react";
import styled from "styled-components";
import { PartialTrainingModule, TrainingModule, TrainingModuleStep } from "../../../domain/entities/TrainingModule";
import { TranslatableText } from "../../../domain/entities/TranslatableText";
import i18n from "../../../locales";
import { FlattenUnion } from "../../../utils/flatten-union";
import { AlertIcon } from "../alert-icon/AlertIcon";
import { MarkdownEditorDialog, MarkdownEditorDialogProps } from "../markdown-editor/MarkdownEditorDialog";
import { MarkdownViewer } from "../markdown-viewer/MarkdownViewer";
import { ModalBody } from "../modal";
import { useAppContext } from "../../contexts/app-context";
import { Dropzone, DropzoneRef } from "../dropzone/Dropzone";
/*import { ObjectsList } from "../objects-list/ObjectsList";
import {
    Pager,
    TableConfig,
    useObjectsTable,
} from "../objects-list/objects-list-hooks";*/

export interface ModuleListTableProps {
    rows: ListItem[];
    refreshRows?: () => Promise<void>;
    tableActions: ModuleListTableAction;
}

export const ModuleListTable: React.FC<ModuleListTableProps> = props => {
    const { rows, tableActions, refreshRows = async () => {} } = props;
    const { usecases } = useAppContext();

    const loading = useLoading();
    const snackbar = useSnackbar();

    const [selection, setSelection] = useState<TableSelection[]>([]);
    const [dialogProps, updateDialog] = useState<ConfirmationDialogProps | null>(null);
    const [editContentsDialogProps, updateEditContentsDialog] = useState<MarkdownEditorDialogProps | null>(null);
    const [showImportDragAndDrop, setShowImportDragAndDrop] = useState<boolean>();
    const fileRef = useRef<DropzoneRef>(null);
    const handleFileUpload = useCallback(
        async (files: File[], rejections: FileRejection[]) => {
            if (files.length === 0 && rejections.length > 0) {
                snackbar.error(i18n.t("Couldn't read the file because it's not valid"));
                return;
            }

            loading.show(true, i18n.t("Reading files"));

            /*const { predictors, warnings } = await usecases.readExcel(files);
            if (warnings && warnings.length > 0) {
                snackbar.warning(warnings.map(({ description }) => description).join("\n"));
            }

            //@ts-ignore TODO FIXME: Add validation
            const response = await compositionRoot.usecases.import(predictors);
            setResponse(response);*/

            loading.reset();
            refreshRows();
        },
        [usecases, loading, snackbar]
    );

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
                    if (!tableActions.deleteModules) return;

                    loading.show(true, i18n.t("Deleting modules"));
                    await tableActions.deleteModules({ ids });
                    loading.reset();

                    snackbar.success("Successfully deleted modules");
                    setSelection([]);
                    await refreshRows();
                },
                cancelText: i18n.t("Cancel"),
                saveText: i18n.t("Delete modules"),
            });
        },
        [tableActions, loading, refreshRows, snackbar]
    );

    const addModule = useCallback(() => {
        if (!tableActions.openCreateModulePage) return;
        tableActions.openCreateModulePage();
    }, [tableActions]);

    const editModule = useCallback(
        (ids: string[]) => {
            if (!tableActions.openEditModulePage || !ids[0]) return;
            tableActions.openEditModulePage({ id: ids[0] });
        },
        [tableActions]
    );

    const moveUpModule = useCallback(
        async (ids: string[]) => {
            const rowIndex = _.findIndex(rows, ({ id }) => id === ids[0]);
            if (!tableActions.swap || rowIndex === -1 || rowIndex === 0) return;

            const { id: prevRowId } = rows[rowIndex - 1] ?? {};
            if (prevRowId && ids[0]) {
                await tableActions.swap({ from: ids[0], to: prevRowId });
            }

            await refreshRows();
        },
        [tableActions, rows, refreshRows]
    );

    const moveDownModule = useCallback(
        async (ids: string[]) => {
            const rowIndex = _.findIndex(rows, ({ id }) => id === ids[0]);
            if (!tableActions.swap || rowIndex === -1 || rowIndex === rows.length - 1) return;

            const { id: nextRowId } = rows[rowIndex + 1] ?? {};
            if (nextRowId && ids[0]) {
                await tableActions.swap({ from: nextRowId, to: ids[0] });
            }

            await refreshRows();
        },
        [tableActions, rows, refreshRows]
    );

    const editContents = useCallback(
        (ids: string[]) => {
            const row = buildChildrenRows(rows).find(({ id }) => id === ids[0]);
            if (!row || !row.value) return;

            const { uploadFile } = tableActions;

            updateEditContentsDialog({
                title: i18n.t("Edit contents of {{name}}", row),
                initialValue: row.value,
                markdownPreview: markdown => <StepPreview value={markdown} />,
                onUpload: uploadFile ? (data: ArrayBuffer) => uploadFile({ data }) : undefined,
                onCancel: () => updateEditContentsDialog(null),
                onSave: () => {
                    // TODO
                    updateEditContentsDialog(null);
                },
            });
        },
        [tableActions, rows]
    );

    const installApp = useCallback(
        async (ids: string[]) => {
            if (!tableActions.installApp || !ids[0]) return;

            loading.show(true, i18n.t("Installing application"));
            const installed = await tableActions.installApp({ id: ids[0] });
            loading.reset();

            if (!installed) {
                snackbar.error("Error installing app");
                return;
            }

            snackbar.success("Successfully installed app");
            await refreshRows();
        },
        [tableActions, snackbar, loading, refreshRows]
    );

    const resetModules = useCallback(
        (ids: string[]) => {
            updateDialog({
                title: i18n.t("Are you sure you want to reset selected modules to its default value?"),
                description: i18n.t("This action cannot be reversed."),
                onCancel: () => updateDialog(null),
                onSave: async () => {
                    updateDialog(null);
                    if (!tableActions.resetModules) return;

                    loading.show(true, i18n.t("Resetting modules to default value"));
                    await tableActions.resetModules({ ids });
                    loading.reset();

                    snackbar.success(i18n.t("Successfully resetted modules to default value"));
                    await refreshRows();
                },
                cancelText: i18n.t("Cancel"),
                saveText: i18n.t("Reset app to factory settings"),
            });
        },
        [tableActions, loading, refreshRows, snackbar]
    );

    const exportModule = useCallback(
        async (ids: string[]) => {
            if (!ids[0]) return;
            loading.show(true, i18n.t("Exporting module"));
            await usecases.modules.export(ids);
            loading.reset();
        },
        [loading, usecases]
    );
    const publishTranslations = useCallback(
        async (ids: string[]) => {
            if (!tableActions.publishTranslations || !ids[0]) return;

            loading.show(true, i18n.t("Initialize project in POEditor"));
            await tableActions.publishTranslations({ id: ids[0] });
            loading.reset();
        },
        [tableActions, loading]
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
                    return item.value && <StepPreview value={item.value.referenceValue} />;
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
                    return !!tableActions.openCreateModulePage && _.every(rows, item => item.rowType === "module");
                },
            },
            {
                name: "edit-module",
                text: i18n.t("Edit module"),
                icon: <Icon>edit</Icon>,
                onClick: editModule,
                isActive: rows => {
                    return (
                        !!tableActions.openEditModulePage &&
                        _.every(rows, item => item.rowType === "module" && item.editable)
                    );
                },
            },
            {
                name: "push-translations",
                text: i18n.t("Push local translations to POEditor"),
                icon: <Icon>publish</Icon>,
                onClick: publishTranslations,
                isActive: rows => {
                    return (
                        isDebug &&
                        !!tableActions.publishTranslations &&
                        _.every(rows, item => item.rowType === "module")
                    );
                },
            },
            {
                name: "delete-module",
                text: i18n.t("Delete module"),
                icon: <Icon>delete</Icon>,
                multiple: true,
                onClick: deleteModules,
                isActive: rows => {
                    return (
                        !!tableActions.deleteModules &&
                        _.every(rows, item => item.rowType === "module" && item.type !== "core")
                    );
                },
            },
            {
                name: "move-up-module",
                text: i18n.t("Move up"),
                icon: <Icon>arrow_upwards</Icon>,
                onClick: moveUpModule,
                isActive: rows => {
                    return !!tableActions.swap && _.every(rows, ({ position }) => position !== 0);
                },
            },
            {
                name: "move-down-module",
                text: i18n.t("Move down"),
                icon: <Icon>arrow_downwards</Icon>,
                onClick: moveDownModule,
                isActive: rows => {
                    return (
                        !!tableActions.swap && _.every(rows, ({ position, lastPosition }) => position !== lastPosition)
                    );
                },
            },
            {
                name: "edit-contents",
                text: i18n.t("Edit contents"),
                icon: <Icon>edit</Icon>,
                onClick: editContents,
                isActive: rows => {
                    return _.every(rows, item => item.rowType === "page" && item.editable);
                },
            },
            {
                name: "install-app",
                text: i18n.t("Install app"),
                icon: <GetAppIcon />,
                onClick: installApp,
                isActive: rows => {
                    return (
                        !!tableActions.installApp && _.every(rows, item => item.rowType === "module" && !item.installed)
                    );
                },
            },
            {
                name: "reset-factory-settings",
                text: i18n.t("Restore to factory settings"),
                icon: <Icon>rotate_left</Icon>,
                onClick: resetModules,
                isActive: rows => {
                    return !!tableActions.resetModules && _.every(rows, item => item.rowType === "module");
                },
            },
            {
                name: "export-module",
                text: i18n.t("Export module"),
                icon: <Icon>get_app</Icon>,
                onClick: exportModule,
                isActive: rows => {
                    return _.every(rows, item => item.rowType === "module");
                },
                multiple: true,
            },
        ],
        [
            tableActions,
            editModule,
            deleteModules,
            moveUpModule,
            moveDownModule,
            editContents,
            installApp,
            publishTranslations,
            addModule,
            resetModules,
            exportModule,
        ]
    );

    return (
        <PageWrapper>
            {editContentsDialogProps && <MarkdownEditorDialog {...editContentsDialogProps} />}
            {dialogProps && <ConfirmationDialog isOpen={true} maxWidth={"xl"} {...dialogProps} />}
            {showImportDragAndDrop && (
                <Dropzone
                    ref={fileRef}
                    accept={"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}
                    onDrop={handleFileUpload}
                >
                    <h1>Here is the dropzone</h1>
                </Dropzone>
            )}
            <div>
                <Icon onClick={() => setShowImportDragAndDrop(true)}>publish</Icon> Import Module
            </div>
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
    value: TranslatableText;
    position: number;
    lastPosition: number;
    editable: boolean;
}

export const buildListModules = (modules: TrainingModule[]): ListItemModule[] => {
    return modules.map((module, moduleIdx) => ({
        ...module,
        name: module.name.referenceValue,
        rowType: "module",
        position: moduleIdx,
        lastPosition: modules.length - 1,
        steps: buildListSteps(module, module.contents.steps),
    }));
};

export const buildListSteps = (module: PartialTrainingModule, steps: TrainingModuleStep[]): ListItemStep[] => {
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
            editable: module.editable ?? false,
            value,
        })),
    }));
};

const buildChildrenRows = (items: ListItem[]): ListItem[] => {
    const steps = _.flatMap(items, item => item.steps);
    const pages = _.flatMap([...items, ...steps], step => step?.pages);
    return _.compact([...items, ...steps, ...pages]);
};

const StepPreview: React.FC<{
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

export type ModuleListTableAction = {
    openEditModulePage?: (params: { id: string }) => void;
    openCreateModulePage?: () => void;
    deleteModules?: (params: { ids: string[] }) => Promise<void>;
    resetModules?: (params: { ids: string[] }) => Promise<void>;
    swap?: (params: { from: string; to: string }) => Promise<void>;
    publishTranslations?: (params: { id: string }) => Promise<void>;
    uploadFile?: (params: { data: ArrayBuffer }) => Promise<string>;
    installApp?: (params: { id: string }) => Promise<boolean>;
};
