import { ObjectsTable, TableColumn } from "d2-ui-components";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { NamedRef } from "../../../domain/entities/Ref";
import { TrainingModule } from "../../../domain/entities/TrainingModule";
import { useAppContext } from "../../contexts/app-context";
import { MarkdownViewer } from "../markdown-viewer/MarkdownViewer";

export const ModuleListTable: React.FC = () => {
    const { usecases } = useAppContext();

    const [modules, setModules] = useState<ModuleListItem[]>([]);

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
                text: "Content",
                getValue: ({ value }) => <StyledStepPreview value={value} />,
            },
            {
                name: "disabled",
                text: "Disabled",
            },
        ],
        []
    );

    useEffect(() => {
        usecases.listModules().then(modules => {
            setModules(buildListItems(modules));
        });
    }, [usecases]);

    return (
        <TableWrapper>
            <ObjectsTable<ModuleListItem>
                rows={modules}
                columns={columns}
                childrenKeys={["steps", "pages"]}
                forceSelectionColumn={true}
            />
        </TableWrapper>
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
        steps: contents.steps.map(({ title, pages, }, stepIdx) => ({
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
        <MarkdownViewer
            className={className}
            source={value}
            escapeHtml={false}
        />
    );
};

const StyledStepPreview = styled(StepPreview)`
    color: black;
`;

const TableWrapper = styled.div`
    .MuiTableCell-root {
        max-width: 450px;
    }
    
    .MuiTableRow-root {
        background: white;
    }
`;
