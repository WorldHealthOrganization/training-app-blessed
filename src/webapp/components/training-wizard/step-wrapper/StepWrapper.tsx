import styled from "styled-components";

export const StepWrapper = styled.div`
    margin: 0;
    max-height: 320px;
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
