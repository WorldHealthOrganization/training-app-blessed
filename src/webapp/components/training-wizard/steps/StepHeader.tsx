import styled from "styled-components";
import React from "react";

export const StepHeader: React.FC<StepHeaderProps> = ({ index, title }) => {
    return (
        <React.Fragment>
            <Bullet>{index}</Bullet>
            <Title>{title}</Title>
        </React.Fragment>
    );
};

const Bullet = styled.span`
    color: white;
    display: inline-block;
    font-size: 27px;
    font-weight: 700;
    border: 2px solid #fff;
    padding: 15px;
    height: 18px;
    width: 18px;
    border-radius: 100px;
    line-height: 20px;
    margin-right: 20px;
`;

const Title = styled.span`
    color: white;
    font-size: 32px;
    line-height: 47px;
    font-weight: 300;
    margin: 0px 0px 30px 0px;
`;

export interface StepHeaderProps {
    index: number;
    title: string;
}
