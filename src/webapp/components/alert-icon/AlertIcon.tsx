import { Icon, IconButton, Tooltip } from "@material-ui/core";
import React from "react";
import styled from "styled-components";

export const AlertIcon: React.FC<AlertIconProps> = React.memo(({ tooltip }) => {
    return (
        <Tooltip title={tooltip} placement="top">
            <StyledIconButton>
                <Icon color="error">warning</Icon>
            </StyledIconButton>
        </Tooltip>
    );
});

export const StyledIconButton = styled(IconButton)`
    padding: 0;
    padding-left: 10px;
`;

export interface AlertIconProps {
    tooltip: string;
}
