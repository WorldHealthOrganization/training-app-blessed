import styled from "styled-components";

export const Cardboard = styled.div<{ rowSize?: number }>`
    display: grid;
    grid-template-columns: repeat(${props => props.rowSize ?? 5}, minmax(0, 1fr));
    margin-right: 10px;
`;
