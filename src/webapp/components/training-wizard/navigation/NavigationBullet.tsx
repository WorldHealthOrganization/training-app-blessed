import React from "react";
import styled from "styled-components";

const SubBullet = (props: { className?: string; completed?: boolean }) => (
    <div className={props.className}></div>
);

export const NavigationBullet = styled(SubBullet)`
    text-align: center;
    width: 20%;
    position: relative;

    font-weight: 700;
    border-radius: 100px;
    height: 10px;
    width: 10px;
    display: inline-block;
    line-height: 34px;
    margin: 18px 10px 0 10px;

    background-color: ${props => (props.completed ? "#43cbcb" : "rgba(255, 255, 255, 0.3)")};
`;
