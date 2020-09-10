import React, { useCallback, useEffect, useState } from "react";
import Draggable, {
    ControlPosition,
    DraggableData,
    DraggableEvent,
    DraggableProps,
} from "react-draggable";
import styled from "styled-components";
import { ModalHeader } from "./ModalHeader";

export const Modal: React.FC<ModalProps> = ({
    className,
    children,
    onClose,
    onMinimize,
    minimized,
    allowDrag,
}) => {
    const [position, setPosition] = useState<ControlPosition>();
    const dragId = "drag-button";

    const clearPosition = useCallback((_event: DraggableEvent, { x, y }: DraggableData) => {
        setPosition({ x, y });
    }, []);

    useEffect(() => {
        setPosition({ x: 0, y: 0 });
    }, [minimized]);

    return (
        <StyledDraggable
            disabled={!allowDrag}
            handle={`#${dragId}`}
            position={position}
            onDrag={clearPosition}
        >
            <ModalWrapper>
                <ModalBody className={className}>
                    <ModalHeader
                        dragId={dragId}
                        minimized={minimized}
                        onClose={onClose}
                        onMinimize={onMinimize}
                        allowDrag={allowDrag}
                    />
                    {children}
                </ModalBody>
            </ModalWrapper>
        </StyledDraggable>
    );
};

export interface ModalProps {
    className?: string;
    onClose?: () => void;
    onMinimize?: () => void;
    minimized?: boolean;
    allowDrag?: boolean;
}

const ModalWrapper = styled.div`
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    text-align: center;
`;

const ModalBody = styled.div`
    background-color: #276696;
    border-radius: 18px;
    padding: 18px;
    font-family: "Roboto", sans-serif;
    color: #fff;
    pointer-events: auto;
`;

const CustomDraggable: React.FC<Partial<DraggableProps> & { className?: string }> = ({
    className,
    children,
    ...rest
}) => {
    return (
        <Draggable {...rest} defaultClassName={className}>
            {children}
        </Draggable>
    );
};

const StyledDraggable = styled(CustomDraggable)`
    /* Required to allow clicks on items behind draggable region */
    pointer-events: none;

    /* Required to not loose dragging focus if cursor goes outside of draggable region*/
    :active {
        pointer-events: all;
    }
`;
