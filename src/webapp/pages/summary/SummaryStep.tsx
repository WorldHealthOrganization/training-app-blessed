import styled from "styled-components";
import { Bullet } from "../../components/training-wizard/stepper/Bullet";

export const Line = styled.div`
    position: absolute;
    top: 50%;
    left: 26px;
    height: 100%;
    border-left: 3px solid #43cbcb;
`;

export const Label = styled.span`
    margin-left: 20px;
    display: inline-block;
    font-size: 20px;
    text-align: left;
    align-self: center;
`;

export const Step = styled.div<{ column: "left" | "right"; row: number; last?: boolean }>`
    padding: 10px;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    background-color: cream;
    position: relative;

    grid-column: ${({ column }) => (column === "left" ? 1 : 2)};
    grid-row: ${({ row }) => row + 1};

    ${Line} {
        display: ${({ last }) => (last ? "none" : "inherit")};
    }

    ${Bullet} {
        position: relative;
        background-color: #43cbcb;
        border: 3px solid #43cbcb;
    }
`;
