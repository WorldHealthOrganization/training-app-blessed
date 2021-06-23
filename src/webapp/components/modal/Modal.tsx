import React, { useCallback, useEffect, useState } from "react";
import { ControlPosition, DraggableData, DraggableEvent } from "react-draggable";
import styled from "styled-components";
import { DragContainer } from "../drag-container/DragContainer";
import { ModalHeader, ModalHeaderProps } from "./ModalHeader";

export const Modal: React.FC<ModalProps> = ({
    className,
    children,
    onClose,
    onMinimize,
    onGoHome,
    onGoBack,
    onSettings,
    onAbout,
    minimized,
    allowDrag,
    centerChildren,
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
        <DragContainer disabled={!allowDrag} handle={`#${dragId}`} position={position} onDrag={clearPosition}>
            <ModalWrapper center={centerChildren}>
                <ModalBody id={dragId} className={className}>
                    <ModalHeader
                        minimized={minimized}
                        onClose={onClose}
                        onGoHome={onGoHome}
                        onGoBack={onGoBack}
                        onSettings={onSettings}
                        onAbout={onAbout}
                        onMinimize={onMinimize}
                        allowDrag={allowDrag}
                    />
                    {children}
                </ModalBody>
            </ModalWrapper>
        </DragContainer>
    );
};

export interface ModalProps extends ModalHeaderProps {
    className?: string;
    centerChildren?: boolean;
}

const ModalWrapper = styled.div<{ center?: boolean }>`
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    text-align: ${props => (props.center ? "center" : "unset")};
    user-select: none;
`;

export const ModalBody = styled.div`
    background-color: #276696;
    border-radius: 18px;
    padding: 18px;
    font-family: "Roboto", sans-serif;
    color: #fff;
    pointer-events: auto;
    box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12),
        0 5px 5px -3px rgba(0, 0, 0, 0.2);
`;
