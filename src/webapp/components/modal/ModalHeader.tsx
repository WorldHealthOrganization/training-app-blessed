import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import MinimizeIcon from "@material-ui/icons/Minimize";
import React from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { Tooltip, TooltipText } from "../tooltip/Tooltip";

export const ModalHeader: React.FC<ModalHeaderProps> = ({
    allowDrag,
    dragId,
    onClose,
    minimized,
    onMinimize,
}) => {
    return (
        <div>
            {allowDrag ? (
                <DragButton text={i18n.t("Move window")}>
                    <DragIndicatorIcon id={dragId} />
                </DragButton>
            ) : null}
            {onClose ? (
                <CloseButton>
                    <CloseIcon onClick={onClose} />
                </CloseButton>
            ) : null}
            {onMinimize && minimized ? (
                <ExpandButton text={i18n.t("Expand window")}>
                    <AddIcon onClick={onMinimize} />
                </ExpandButton>
            ) : onMinimize ? (
                <MinimizeButton text={i18n.t("Minimize window")}>
                    <MinimizeIcon onClick={onMinimize} />
                </MinimizeButton>
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

const DragButton = styled(Tooltip)`
    position: absolute;
    left: 50%;
    cursor: pointer;

    svg {
        font-size: 24px !important;
        font-weight: bold;

        -webkit-transform: rotate(90deg);
        -moz-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
        -o-transform: rotate(90deg);
        transform: rotate(90deg);
    }

    ${TooltipText} {
        top: -2px;
    }
`;

const CloseButton = styled.div`
    float: right;
    cursor: pointer;

    svg {
        font-size: 20px !important;
        font-weight: bold;
        margin-right: 8px;
    }
`;

const MinimizeButton = styled(Tooltip)`
    float: right;
    cursor: pointer;

    svg {
        font-size: 18px !important;
        font-weight: bold;
    }

    ${TooltipText} {
        top: -10px;
    }
`;

const ExpandButton = styled(Tooltip)`
    float: right;
    cursor: pointer;

    svg {
        font-size: 18px !important;
        font-weight: bold;
    }
`;
