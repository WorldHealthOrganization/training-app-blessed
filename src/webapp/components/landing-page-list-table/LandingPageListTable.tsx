import {
    ConfirmationDialog,
    ConfirmationDialogProps,
    ObjectsTable,
    TableAction,
    TableColumn,
    TableGlobalAction,
    useLoading,
    useSnackbar,
} from "@eyeseetea/d2-ui-components";
import { Icon } from "@material-ui/core";
import _ from "lodash";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { FileRejection } from "react-dropzone";
import styled from "styled-components";
import { LandingNode, LandingNodeType } from "../../../domain/entities/LandingPage";
import i18n from "../../../locales";
import { MarkdownViewer } from "../../components/markdown-viewer/MarkdownViewer";
import { useAppContext } from "../../contexts/app-context";
import { Dropzone, DropzoneRef } from "../dropzone/Dropzone";
import { ImportTranslationDialog, ImportTranslationRef } from "../import-translation-dialog/ImportTranslationDialog";
import { LandingPageEditDialog, LandingPageEditDialogProps } from "../landing-page-edit-dialog/LandingPageEditDialog";
import { ModalBody } from "../modal";

export const LandingPageListTable: React.FC<{ nodes: LandingNode[]; isLoading?: boolean }> = ({ nodes, isLoading }) => {
    const { usecases, reload } = useAppContext();

    const loading = useLoading();
    const snackbar = useSnackbar();

    const landingImportRef = useRef<DropzoneRef>(null);
    const translationImportRef = useRef<ImportTranslationRef>(null);

    const [dialogProps, updateDialog] = useState<ConfirmationDialogProps | null>(null);
    const [editDialogProps, updateEditDialog] = useState<LandingPageEditDialogProps | null>(null);

    const openImportDialog = useCallback(async () => {
        landingImportRef.current?.openDialog();
    }, [landingImportRef]);

    const handleFileUpload = useCallback(
        async (files: File[], rejections: FileRejection[]) => {
            if (files.length === 0 && rejections.length > 0) {
                snackbar.error(i18n.t("Couldn't read the file because it's not valid"));
            } else {
                loading.show(true, i18n.t("Importing landing pages(s)"));
                try {
                    updateDialog({
                        title: i18n.t("Importing a new landing page"),
                        description: i18n.t("This action will overwrite the existing landing page. Are you sure?"),
                        onSave: async () => {
                            const landings = await usecases.landings.import(files);
                            snackbar.success(i18n.t("Imported {{n}} landing pages", { n: landings.length }));
                            await reload();
                            updateDialog(null);
                        },
                        onCancel: () => {
                            updateDialog(null);
                        },
                        saveText: i18n.t("Yes"),
                        cancelText: i18n.t("No"),
                    });
                } catch (err) {
                    snackbar.error((err && err.message) || err.toString());
                } finally {
                    loading.reset();
                }
            }
        },
        [snackbar, reload, usecases, loading]
    );

    const handleTranslationUpload = useCallback(
        async (_key: string | undefined, lang: string, terms: Record<string, string>) => {
            await usecases.landings.importTranslations(lang, terms);
            snackbar.success(i18n.t("Imported {{total}} translation terms", { total: _.keys(terms).length }));
        },
        [usecases, snackbar]
    );

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
                getValue: item => item.name?.referenceValue ?? "-",
            },
            {
                name: "title",
                text: "Title",
                getValue: item => item.title?.referenceValue ?? "-",
            },
            {
                name: "content",
                text: "Content",
                getValue: item => (item.content ? <StepPreview value={item.content.referenceValue} /> : "-"),
            },
            {
                name: "icon",
                text: "Icon",
                getValue: item =>
                    item.icon ? <ItemIcon src={item.icon} alt={`Icon for ${item.name.referenceValue}`} /> : "-",
            },
        ],
        []
    );

    const actions: TableAction<LandingNode>[] = useMemo(
        () => [
            {
                name: "add-section",
                text: i18n.t("Add section"),
                icon: <Icon>add</Icon>,
                onClick: ids => {
                    const parent = flattenRows(nodes).find(({ id }) => id === ids[0]);
                    if (!parent) return;

                    updateEditDialog({
                        title: i18n.t("Add section"),
                        type: "section",
                        parent: parent.id,
                        order: parent.children.length,
                        onCancel: () => updateEditDialog(null),
                        onSave: async node => {
                            updateEditDialog(null);
                            await usecases.landings.update(node);
                            await reload();
                        },
                    });
                },
                isActive: nodes => _.every(nodes, item => item.type === "root"),
            },
            {
                name: "add-sub-section",
                text: i18n.t("Add sub-section"),
                icon: <Icon>add</Icon>,
                onClick: ids => {
                    const parent = flattenRows(nodes).find(({ id }) => id === ids[0]);
                    if (!parent) return;

                    updateEditDialog({
                        title: i18n.t("Add sub-section"),
                        type: "sub-section",
                        parent: parent.id,
                        order: parent.children.length,
                        onCancel: () => updateEditDialog(null),
                        onSave: async node => {
                            updateEditDialog(null);
                            await usecases.landings.update(node);
                            await reload();
                        },
                    });
                },
                isActive: nodes => _.every(nodes, item => item.type === "section"),
            },
            {
                name: "add-category",
                text: i18n.t("Add category"),
                icon: <Icon>add</Icon>,
                onClick: ids => {
                    const parent = flattenRows(nodes).find(({ id }) => id === ids[0]);
                    if (!parent) return;

                    updateEditDialog({
                        title: i18n.t("Add category"),
                        type: "category",
                        parent: parent.id,
                        order: parent.children.length,
                        onCancel: () => updateEditDialog(null),
                        onSave: async node => {
                            updateEditDialog(null);
                            await usecases.landings.update(node);
                            await reload();
                        },
                    });
                },
                isActive: nodes => _.every(nodes, item => item.type === "sub-section" || item.type === "category"),
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
                        order: node.order ?? 0,
                        onCancel: () => updateEditDialog(null),
                        onSave: async node => {
                            updateEditDialog(null);
                            await usecases.landings.update(node);
                            await reload();
                        },
                    });
                },
                isActive: nodes => _.every(nodes, item => item.type !== "root"),
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
            {
                name: "export-landing-page",
                text: i18n.t("Export landing page"),
                icon: <Icon>cloud_download</Icon>,
                onClick: async (ids: string[]) => {
                    if (!ids[0]) return;
                    loading.show(true, i18n.t("Exporting landing page(s)"));
                    await usecases.landings.export(ids);
                    loading.reset();
                },
                isActive: nodes => _.every(nodes, item => item.type === "root"),
                multiple: true,
            },
            {
                name: "export-translations",
                text: i18n.t("Export JSON translations"),
                icon: <Icon>translate</Icon>,
                onClick: async () => {
                    loading.show(true, i18n.t("Exporting translations"));
                    await usecases.landings.exportTranslations();
                    loading.reset();
                },
                isActive: nodes => _.every(nodes, item => item.type === "root"),
                multiple: false,
            },
        ],
        [usecases, reload, loading, nodes]
    );

    const globalActions: TableGlobalAction[] | undefined = useMemo(
        () => [
            {
                name: "import",
                text: i18n.t("Import landing pages"),
                icon: <Icon>arrow_upward</Icon>,
                onClick: openImportDialog,
            },
            {
                name: "import-translations",
                text: i18n.t("Import JSON translations"),
                icon: <Icon>translate</Icon>,
                onClick: () => {
                    translationImportRef.current?.startImport();
                },
            },
        ],
        [openImportDialog]
    );

    return (
        <React.Fragment>
            {dialogProps && <ConfirmationDialog isOpen={true} maxWidth={"xl"} {...dialogProps} />}
            {editDialogProps && <LandingPageEditDialog isOpen={true} {...editDialogProps} />}

            <ImportTranslationDialog type="landing-page" ref={translationImportRef} onSave={handleTranslationUpload} />

            <Dropzone
                ref={landingImportRef}
                accept={"application/zip,application/zip-compressed,application/x-zip-compressed"}
                onDrop={handleFileUpload}
            >
                <ObjectsTable<LandingNode>
                    rows={nodes}
                    columns={columns}
                    actions={actions}
                    globalActions={globalActions}
                    childrenKeys={["children"]}
                    loading={isLoading}
                />
            </Dropzone>
        </React.Fragment>
    );
};

const getTypeName = (type: LandingNodeType) => {
    switch (type) {
        case "root":
            return i18n.t("Landing page");
        case "section":
            return i18n.t("Section");
        case "sub-section":
            return i18n.t("Sub-section");
        case "category":
            return i18n.t("Category");
        default:
            return "-";
    }
};

const flattenRows = (rows: LandingNode[]): LandingNode[] => {
    return _.flatMap(rows, row => [row, ...flattenRows(row.children)]);
};

const ItemIcon = styled.img`
    width: 100px;
`;

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
