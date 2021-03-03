import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import React, { ReactNode } from "react";
import styled from "styled-components";

export interface ContextualMenuProps {
    id: string;
    isOpen: boolean;
    positionLeft: number;
    positionTop: number;
    onClose(): void;
    actions: TableAction[];
}

export const ContextualMenu: React.FC<ContextualMenuProps> = props => {
    const { id, isOpen, positionLeft, positionTop, onClose, actions } = props;

    const handleActionClick = (action: TableAction) => {
        return () => {
            if (action.onClick) action.onClick(id);
            onClose();
        };
    };

    return (
        <Container
            open={isOpen}
            anchorReference="anchorPosition"
            disableScrollLock={true}
            anchorPosition={{
                left: positionLeft,
                top: positionTop,
            }}
            onClose={onClose}
        >
            {actions.map(action => (
                <Item key={action.name} onClick={handleActionClick(action)}>
                    <Icon>{action.icon}</Icon>

                    <Text noWrap>{action.text}</Text>
                </Item>
            ))}
        </Container>
    );
};

const Container = styled(Menu)`
    position: fixed;
`;

const Item = styled(MenuItem)`
    padding-top: 8px;
    padding-bottom: 8px;
`;

const Text = styled(Typography)`
    padding-left: 10px;
    padding-right: 15px;
`;

const Icon = styled.div`
    display: flex;
    padding-left: 6px;
    padding-right: 10px;
`;

export interface TableAction {
    name: string;
    text: string;
    icon?: ReactNode;
    onClick?(id: string): void;
}
