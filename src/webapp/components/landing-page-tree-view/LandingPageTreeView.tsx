import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import TreeItem from "@material-ui/lab/TreeItem";
import TreeView from "@material-ui/lab/TreeView";
import React from "react";
import styled from "styled-components";
import { LandingNode } from "../../../domain/entities/LandingPage";

export const LandingPageTreeView: React.FC<{ root: LandingNode }> = ({ root }) => {
    return (
        <StyledTreeView
            defaultExpanded={["1"]}
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
        >
            <LandingPageTreeItem node={root} />
        </StyledTreeView>
    );
};

export const LandingPageTreeItem: React.FC<{ node: any }> = ({ node }) => {
    return (
        <StyledTreeItem nodeId={node.id} label={node.name?.referenceValue ?? "foo"}>
            {node.children?.map((subnode: any) => (
                <LandingPageTreeItem key={subnode.id} node={subnode} />
            ))}
        </StyledTreeItem>
    );
};

const StyledTreeView = styled(TreeView)`
    height: 264px;
    flex-grow: 1;
    max-width: 400px;
`;

const StyledTreeItem = styled(TreeItem)``;

/**
iconContainer: {
            "& .close": {
                opacity: 0.3,
            },
        },
        group: {
            marginLeft: 7,
            paddingLeft: 18,
            borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
        },
 */

const MinusSquare: React.FC<SvgIconProps> = props => {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
        </SvgIcon>
    );
};

const PlusSquare: React.FC<SvgIconProps> = props => {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
        </SvgIcon>
    );
};
