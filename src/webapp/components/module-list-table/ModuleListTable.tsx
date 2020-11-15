import { Icon, IconButton, Tooltip } from "@material-ui/core";
import { ObjectsTable, TableColumn } from "d2-ui-components";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { NamedRef } from "../../../domain/entities/Ref";
import { TrainingModule } from "../../../domain/entities/TrainingModule";
import { useAppContext } from "../../contexts/app-context";
import { MarkdownViewer } from "../markdown-viewer/MarkdownViewer";
import { ModalBody } from "../modal";
import { ModuleCreationDialog } from "../module-creation-dialog/ModuleCreationDialog";

export const ModuleListTable: React.FC = () => {
    const { usecases } = useAppContext();

    const [loading, setLoading] = useState<boolean>(true);
    const [modules, setModules] = useState<ModuleListItem[]>([]);
    const [isCreationDialogOpen, setOpenCreationDialog] = useState<boolean>(false);
    const [refreshKey, setRefreshKey] = useState(Math.random());

    const columns: TableColumn<ModuleListItem>[] = useMemo(
        () => [
            {
                name: "name",
                text: "Name",
            },
            {
                name: "id",
                text: "Code",
                hidden: true,
            },
            {
                name: "value",
                text: "Preview",
                getValue: ({ value }) => <StyledStepPreview value={value} />,
            },
            {
                name: "disabled",
                text: "Disabled",
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

            <ObjectsTable<ModuleListItem>
                loading={loading}
                rows={modules}
                columns={columns}
                childrenKeys={["steps", "pages"]}
                forceSelectionColumn={true}
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

interface ModuleListItem extends Omit<TrainingModule, "contents"> {
    steps: ModuleListStep[];
    value?: string;
}

interface ModuleListStep {
    id: string;
    name: string;
    pages: ModuleListStepPage[];
}

interface ModuleListStepPage extends NamedRef {
    value: string;
}

const buildListItems = (modules: TrainingModule[]): ModuleListItem[] => {
    return modules.map(({ contents, ...module }) => ({
        ...module,
        value: `# ${contents.welcome.title}\n\n${contents.welcome.description}`,
        steps: contents.steps.map(({ title, pages }, stepIdx) => ({
            id: `step-${stepIdx + 1}`,
            name: `Step ${stepIdx + 1}: ${title}`,
            pages: pages.map((value, pageIdx) => ({
                id: `page-${stepIdx + 1}-${stepIdx + 1}`,
                name: `Page ${pageIdx + 1}`,
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
