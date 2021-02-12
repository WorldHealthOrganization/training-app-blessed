import { Icon, Tooltip, IconButton } from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import {
    ObjectsTable,
    TableAction,
    TableColumn,
    TableSelection,
    TableState,
    useLoading,
    useSnackbar,
} from "d2-ui-components";
import _ from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { TrainingModule, TrainingModuleBuilder } from "../../../domain/entities/TrainingModule";
import i18n from "../../../locales";
import { FlattenUnion } from "../../../utils/flatten-union";
import { useAppContext } from "../../contexts/app-context";
import {
    MarkdownEditorDialog,
    MarkdownEditorDialogProps,
} from "../markdown-editor/MarkdownEditorDialog";
import { MarkdownViewer } from "../markdown-viewer/MarkdownViewer";
import { ModalBody } from "../modal";
import { ModuleCreationDialog } from "../module-creation-dialog/ModuleCreationDialog";
import { FetchHttpClient } from "../../../data/clients/http/FetchHttpClient";

export const ModuleListTable: React.FC = () => {
    const { usecases } = useAppContext();
    const loading = useLoading();
    const snackbar = useSnackbar();

    const [tableLoading, setTableLoading] = useState<boolean>(true);
    const [modules, setModules] = useState<ListItemModule[]>([]);
    const [selection, setSelection] = useState<TableSelection[]>([]);
    const [
        editContentsDialogProps,
        updateEditContentsDialog,
    ] = useState<MarkdownEditorDialogProps | null>(null);
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
            setTableLoading(true);
            await usecases.modules.delete(ids);
            setRefreshKey(Math.random());
            setTableLoading(false);
            setSelection([]);
            snackbar.info("Logic not implemented yet");
        },
        [usecases, snackbar]
    );

    const editModule = useCallback(
        (ids: string[]) => {
            const row = modules.find(({ id }) => id === ids[0]);
            if (row) {
                setEditModuleCreationDialog({
                    id: row.id,
                    name: row.name,
                    poEditorProject: row.translation.project ?? "",
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

    const editContents = useCallback(
        (ids: string[]) => {
            const row = buildChildrenRows(modules).find(({ id }) => id === ids[0]);
            if (!row) return;

            updateEditContentsDialog({
                title: i18n.t("Edit contents of {{name}}", row),
                initialValue: row.value ?? "",
                onCancel: () => updateEditContentsDialog(null),
                onSave: () => {
                    // TODO
                    updateEditContentsDialog(null);
                },
                markdownPreview: markdown => <StepPreview value={markdown} rowType={row.rowType} />,
            });
        },
        [modules]
    );

    const installApp = useCallback(
        async (ids: string[]) => {
            const row = buildChildrenRows(modules).find(({ id }) => id === ids[0]);
            if (!row) return;
            const appStoreClient = new FetchHttpClient({ baseUrl: "https://apps.dhis2.org" });
            const AllAppsResponse = await appStoreClient
                .request<App[]>({
                    method: "get",
                    url: "/api/apps",
                })
                .getData();
            const appId = AllAppsResponse.filter(app => app.name === row.name)[0].versions[0].id;
            const isAppInstalled = await usecases.instance.installApp(appId);
            if (isAppInstalled) {
                row.installed = true;
                snackbar.success("Successfully installed app");
            } else {
                snackbar.error("Error installing app");
            }
        },
        [modules, snackbar, usecases]
    );

    const publishTranslations = useCallback(
        async (ids: string[]) => {
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
                getValue: item =>
                    !item.installed && item.rowType === "module" ? (
                        <div>
                            {item.name}
                            <Tooltip
                                title={i18n.t(
                                    "App is not installed. Click install app within Actions to install app."
                                )}
                                placement="top"
                            >
                                <IconButton>
                                    <Icon color="error">warning</Icon>
                                </IconButton>
                            </Tooltip>
                        </div>
                    ) : (
                        <div>{item.name}</div>
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
                    return item.value && <StepPreview value={item.value} rowType={item.rowType} />;
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
                isActive: _rows => {
                    // TODO: Action is disabled for now
                    //return false;
                    return _.every(_rows, item => item.rowType === "module");
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
            {
                name: "edit-contents",
                text: i18n.t("Edit contents"),
                icon: <Icon>edit</Icon>,
                onClick: editContents,
                isActive: rows => {
                    return _.every(
                        rows,
                        item => item.rowType === "page" || item.rowType === "dialog"
                    );
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
        ],
        [
            modules,
            editModule,
            deleteModules,
            moveUpModule,
            moveDownModule,
            editContents,
            installApp,
            publishTranslations,
        ]
    );

    useEffect(() => {
        usecases.modules.list().then(modules => {
            setModules(buildListItems(modules));
            setTableLoading(false);
        });
    }, [usecases, refreshKey]);

    return (
        <PageWrapper>
            {editContentsDialogProps && <MarkdownEditorDialog {...editContentsDialogProps} />}

            {isCreationDialogOpen && (
                <ModuleCreationDialog
                    onClose={closeCreationDialog}
                    builder={editModuleCreationDialog}
                />
            )}

            <ObjectsTable<ListItem>
                loading={tableLoading}
                rows={modules}
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

type ListItem = FlattenUnion<ListItemModule | ListItemStep | ListItemPage>;

interface ListItemModule extends Omit<TrainingModule, "name"> {
    name: string;
    rowType: "module";
    steps: ListItemStep[];
    welcome: ListItemStep[];
    position: number;
}

interface ListItemStep {
    id: string;
    name: string;
    rowType: "step";
    pages: ListItemPage[];
    position: number;
}

interface ListItemPage {
    id: string;
    name: string;
    rowType: "page" | "dialog";
    value: string;
    position: number;
}

const buildListItems = (modules: TrainingModule[]): ListItemModule[] => {
    return modules.map((module, moduleIdx) => ({
        ...module,
        name: module.name.referenceValue,
        rowType: "module",
        position: moduleIdx,
        welcome: [
            {
                id: `${module.id}-welcome-step`,
                name: "Welcome page",
                rowType: "step",
                position: 0,
                pages: [
                    {
                        id: `${module.id}-welcome-page`,
                        name: "Welcome dialog",
                        rowType: "dialog",
                        position: 0,
                        value: module.contents.welcome.referenceValue,
                    },
                ],
            },
        ],
        steps: module.contents.steps.map(({ title, pages }, stepIdx) => ({
            id: `${module.id}-step-${stepIdx + 1}`,
            name: `Step ${stepIdx + 1}: ${title.referenceValue}`,
            rowType: "step",
            position: stepIdx + 1,
            pages: pages.map((value, pageIdx) => ({
                id: `${module.id}-page-${stepIdx + 1}-${stepIdx + 1}`,
                name: `Page ${pageIdx + 1}`,
                rowType: "page",
                position: pageIdx,
                value: value.referenceValue,
            })),
        })),
    }));
};

const buildChildrenRows = (items: ListItemModule[]): ListItem[] => {
    const steps = _.flatMap(items, item => [...item.welcome, ...item.steps]);
    const pages = _.flatMap(steps, step => step.pages);
    return [...items, ...steps, ...pages];
};

export const StepPreview: React.FC<{
    className?: string;
    value?: string;
    rowType: "module" | "step" | "page" | "dialog";
}> = ({ className, value, rowType }) => {
    if (!value) return null;

    return (
        <StyledModalBody className={className}>
            <MarkdownViewer source={value} center={rowType === "dialog"} />
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

interface App {
    appType: string;
    created: Date;
    description: string;
    developer: Developer;
    id: string;
    images: Image[];
    lastUpdated: Date;
    name: string;
    owner: string;
    reviews: [];
    sourceUrl: string;
    status: string;
    versions: Version[];
}
interface Version {
    channel: string;
    created: Date;
    demoUrl: string;
    downloadUrl: string;
    id: string;
    lastUpdated: Date;
    maxDhisVersion: string;
    minDhisVersion: string;
    version: string;
}
interface Developer {
    address: string;
    email: string;
    name: string;
    organization: string;
}
interface Image {
    caption: string;
    created: Date;
    description: string;
    id: string;
    imageUrl: string;
    lastUpdated: Date;
    logo: boolean;
}
