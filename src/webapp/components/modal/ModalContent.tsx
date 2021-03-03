import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const ModalContentBase: React.FC<ModalContentProps> = ({ className, children }) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (ref.current) ref.current.scrollTop = 0;
    }, [children]);

    return (
        <div className={className} ref={ref}>
            {children}
        </div>
    );
};

export const ModalContent = styled(ModalContentBase)`
    max-width: ${({ bigger }) => (bigger ? "none" : "600px")};
    width: ${({ bigger }) => (bigger ? "700px" : "inherit")};

    padding: 0px 15px;
    max-height: 50vh;

    margin: 0;
    overflow-x: hidden;
    overflow-y: scroll;
    overflow-y: overlay;
    scrollbar-width: thin;
    scrollbar-color: #fff #6894b5;

    * {
        margin-right: 10px;
    }

    ::-webkit-scrollbar {
        width: 20px;
    }

    ::-webkit-scrollbar-track {
        width: 4px !important;
        background: rgba(255, 255, 255, 0.3);
        border: 6px solid transparent;
        border-radius: 10px;
        background-clip: content-box;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #fff;
        border: 6px solid transparent;
        border-radius: 10px;
        background-clip: content-box;
    }

    ::-webkit-scrollbar-button {
        display: block;
        color: #fff;
        height: 40px;
        width: 20px;
    }

    ::-webkit-scrollbar-button:vertical:increment {
        background: url(./img/arrow-down.svg) no-repeat 50% 50%;
        background-size: contain;
        color: #fff;
        display: block;
        height: 40px;
        width: 20px !important;
        margin-top: 10px;
    }

    ::-webkit-scrollbar-button:vertical:decrement {
        background: url(./img/arrow-up.svg) no-repeat 50% 50%;
        background-size: contain;
        color: #fff;
        display: block;
        height: 40px;
        width: 20px !important;
        margin-bottom: 10px;
    }

    ::-webkit-scrollbar-button:vertical:start:increment,
    ::-webkit-scrollbar-button:vertical:end:decrement,
    ::-webkit-scrollbar-button:horizontal:end:increment,
    ::-webkit-scrollbar-button:horizontal:end:decrement {
        display: none;
    }
`;

interface ModalContentProps {
    className?: string;
    bigger?: boolean;
}
