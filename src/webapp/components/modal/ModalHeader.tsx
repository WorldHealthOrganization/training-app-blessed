import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import MinimizeIcon from "@material-ui/icons/Minimize";
import React from "react";
import styled from "styled-components";

export const ModalHeader = ({
    allowDrag,
    dragId,
    onClose,
    minimized,
    onMinimize,
}: ModalHeaderProps) => {
    return (
        <div>
            {allowDrag ? <DragButton id={dragId} /> : null}
            {onClose ? <CloseButton onClick={onClose} /> : null}
            {onMinimize && minimized ? (
                <ExpandButton onClick={onMinimize} />
            ) : onMinimize ? (
                <MinimizeButton onClick={onMinimize} />
            ) : null}
        </div>
    );
};

export interface ModalHeaderProps {
    allowDrag?: boolean;
    dragId: string;
    onClose?: () => void;
    minimized?: boolean;
    onMinimize?: () => void;
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

const ExpandButton = styled(AddIcon)`
    float: right;
    font-size: 18px !important;
    font-weight: bold;
    cursor: pointer;
`;
