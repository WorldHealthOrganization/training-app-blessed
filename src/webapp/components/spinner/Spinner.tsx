import styled from "styled-components";

export const Spinner = styled.div`
    border: 5px solid #f3f3f3;
    -webkit-animation: spin 1s linear infinite;
    animation: spin 1s linear infinite;
    border-top: 5px solid transparent;
    border-radius: 50%;
    width: 50px;
    height: 50px;
`;
