import styled from "styled-components";

export const ModalContent = styled.div<{ bigger?: boolean }>`
    padding: 15px;
    max-width: ${({ bigger }) => (bigger ? "none" : "600px")};
    width: ${({ bigger }) => (bigger ? "700px" : "inherit")};
    height: 100%;

    margin: 0;
    overflow-x: hidden;
    overflow-y: scroll;
    overflow-y: overlay;
    scrollbar-width: thin;
    scrollbar-color: #6894b5 transparent;

    ::-webkit-scrollbar {
        width: 6px;
    }

    ::-webkit-scrollbar-track {
        background: #276696;
        border-radius: 6px;
    }

    ::-webkit-scrollbar-thumb {
        background: #6894b5;
        border-radius: 6px;
    }
`;
