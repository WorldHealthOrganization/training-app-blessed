import styled from "styled-components";

export const ModalContent = styled.div<{ bigger?: boolean }>`
    padding: 15px;
    max-width: ${({ bigger }) => (bigger ? "none" : "600px")};
    width: ${({ bigger }) => (bigger ? "700px" : "inherit")};

    margin: 0;
    overflow-x: hidden;
    overflow-y: auto;

    ::-webkit-scrollbar {
        width: 4px;
    }

    ::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb {
        background: #fff;
        border-radius: 4px;
    }
`;
