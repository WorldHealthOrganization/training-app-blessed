import styled from "styled-components";

export const ModalContent = styled.div`
    padding: 15px;
    max-width: 600px;

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
