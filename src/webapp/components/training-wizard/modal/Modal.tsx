import React, { useCallback, useEffect, useState } from "react";
import Draggable, { ControlPosition, DraggableEvent, DraggableData } from "react-draggable";
import styled from "styled-components";
import { ModalHeader } from "./ModalHeader";

export const Modal: React.FC<ModalProps> = ({ children, onClose, onMinimize, minimized }) => {
    const [position, setPosition] = useState<ControlPosition>();
    const dragId = "drag-button";

    const clearPosition = useCallback((_event: DraggableEvent, { x, y }: DraggableData) => {
        setPosition({ x, y });
    }, []);

    useEffect(() => {
        setPosition({ x: 0, y: 0 });
    }, [minimized]);

    return (
        <Draggable handle={`#${dragId}`} position={position} onDrag={clearPosition}>
            <ModalWrapper>
                <ModalBody>
                    <ModalHeader
                        dragId={dragId}
                        minimized={minimized}
                        onClose={onClose}
                        onMinimize={onMinimize}
                    />
                    {children}
                </ModalBody>
            </ModalWrapper>
        </Draggable>
    );
};

export interface ModalProps {
    onClose: () => void;
    onMinimize: () => void;
    minimized: boolean;
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
    position: fixed;
    margin: 6px;
    bottom: 20px;
    right: 40px;
    min-width: 400px;

    background-color: #276696;
    border-radius: 18px;
    padding: 18px;
    font-family: "Roboto", sans-serif;
    color: #fff;
`;
