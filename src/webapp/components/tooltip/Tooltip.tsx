import React from "react";
import styled from "styled-components";

export const Tooltip: React.FC<TooltipProps> = ({ className, text, children }) => {
    return (
        <TooltipWrapper className={className}>
            {children}
            <TooltipText>{text}</TooltipText>
        </TooltipWrapper>
    );
};

export interface TooltipProps {
    className?: string;
    text: string;
}

export const TooltipText = styled.span`
    visibility: hidden;
    width: 120px;
    background-color: #fff;
    color: #276696;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;

    /* Position the tooltip text - see examples below! */
    position: absolute;
    z-index: 1;
    top: -5px;
    right: 150%;

    ::after {
        content: " ";
        position: absolute;
        top: 50%;
        left: 100%; /* To the right of the tooltip */
        margin-top: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: transparent transparent transparent white;
    }
`;

export const TooltipWrapper = styled.div`
    position: relative;
    float: right;

    :not(:active):hover ${TooltipText} {
        visibility: visible;
    }
`;
