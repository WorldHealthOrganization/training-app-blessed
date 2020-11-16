import { Icon, IconButton, Tooltip } from "@material-ui/core";
import { ObjectsTable, TableColumn } from "d2-ui-components";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { NamedRef } from "../../../domain/entities/Ref";
import { TrainingModule } from "../../../domain/entities/TrainingModule";
import { FlattenUnion } from "../../../utils/flatten-union";
import { useAppContext } from "../../contexts/app-context";
import { MarkdownViewer } from "../markdown-viewer/MarkdownViewer";
import { ModalBody } from "../modal";
import { ModuleCreationDialog } from "../module-creation-dialog/ModuleCreationDialog";

export const ModuleListTable: React.FC = () => {
    const { usecases } = useAppContext();

    const [loading, setLoading] = useState<boolean>(true);
    const [modules, setModules] = useState<ListItemModule[]>([]);
    const [isCreationDialogOpen, setOpenCreationDialog] = useState<boolean>(false);
    const [refreshKey, setRefreshKey] = useState(Math.random());

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

    const closeCreationDialog = useCallback(() => {
        setOpenCreationDialog(false);
        setRefreshKey(Math.random());
    }, []);

    useEffect(() => {
        usecases.listModules().then(modules => {
            setModules(buildListItems(modules));
            setLoading(false);
        });
    }, [usecases, refreshKey]);

    return (
        <PageWrapper>
            {isCreationDialogOpen && <ModuleCreationDialog onClose={closeCreationDialog} />}

            <ObjectsTable<ListItem>
                loading={loading}
                rows={modules}
                columns={columns}
                childrenKeys={["steps", "pages"]}
                forceSelectionColumn={true}
                sorting={{ field: "position", order: "asc" }}
                filterComponents={
                    <Tooltip title={"New module"} placement={"right"}>
                        <IconButton onClick={() => setOpenCreationDialog(true)}>
                            <Icon>add_box</Icon>
                        </IconButton>
                    </Tooltip>
                }
            />
        </PageWrapper>
    );
};

type ListItem = FlattenUnion<ListItemModule | ListItemStep | ListItemPage>;

interface ListItemModule extends Omit<TrainingModule, "contents"> {
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
    return modules.map(({ contents, ...module }, moduleIdx) => ({
        ...module,
        rowType: "module",
        position: moduleIdx,
        value: `# ${contents.welcome.title}\n\n${contents.welcome.description}`,
        steps: contents.steps.map(({ title, pages }, stepIdx) => ({
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
