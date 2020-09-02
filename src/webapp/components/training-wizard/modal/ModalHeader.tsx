import CloseIcon from "@material-ui/icons/Close";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import MinimizeIcon from "@material-ui/icons/Minimize";
import React from "react";
import styled from "styled-components";

export const ModalHeader = ({ dragId, onClose, onMinimize }: ModalHeaderProps) => {
    return (
        <div>
            <DragButton id={dragId} />
            <CloseButton onClick={onClose} />
            <MinimizeButton onClick={onMinimize} />
        </div>
    );
};

export interface ModalHeaderProps {
    dragId: string;
    onClose: () => void;
    onMinimize: () => void;
}

const DragButton = styled(DragIndicatorIcon)`
    position: fixed;
    font-size: 24px !important;
    font-weight: bold;
    margin-right: 8px;
    cursor: pointer;

    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    transform: rotate(90deg);
`;

const CloseButton = styled(CloseIcon)`
    float: right;
    font-size: 20px !important;
    font-weight: bold;
    margin-right: 8px;
    cursor: pointer;
`;

const MinimizeButton = styled(MinimizeIcon)`
    float: right;
    font-size: 18px !important;
    font-weight: bold;
    cursor: pointer;
`;
