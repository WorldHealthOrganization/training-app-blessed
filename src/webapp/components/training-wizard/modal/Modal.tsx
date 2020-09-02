import React from "react";
import Draggable from "react-draggable";
import styled from "styled-components";
import { ModalHeader } from "./ModalHeader";

export const Modal: React.FC<ModalProps> = ({ children, onClose, onMinimize, minimized }) => {
    const dragId = "drag-button";
    return (
        <Draggable handle={`#${dragId}`}>
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

    background-color: #276696;
    border-radius: 18px;
    padding: 18px;
    font-family: "Roboto", sans-serif;
    color: #fff;
`;
