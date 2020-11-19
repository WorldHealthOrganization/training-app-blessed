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
    scrollbar-color: #fff transparent;

    ::-webkit-scrollbar {
        width: 6px;
    }

    ::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 6px;
    }

    ::-webkit-scrollbar-thumb {
        background: #fff;
        border-radius: 6px;
    }
`;
