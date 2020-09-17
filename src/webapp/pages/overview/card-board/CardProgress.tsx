import styled from "styled-components";

export const CardProgress = styled.progress`
    display: inline-block;
    width: 100%;
    height: 20px;
    padding: 9px 0 0 0;
    margin: 0;
    background: none;
    border: 0;
    border-radius: 18px;

    ::-webkit-progress-bar {
        height: 12px;
        width: 100%;
        margin: 0 auto;
        background-color: #c6d8e6;
        border-radius: 15px;
    }

    ::-webkit-progress-value {
        float: left;
        height: 12px;
        margin: 0px -10px 0 0;
        background: #43cbcb;
        border-radius: 12px;
    }

    :after {
        margin: -26px 0 0 -7px;
        padding: 0;
        float: left;
    }
`;

export const CardProgressText = styled.span`
    float: right;
    display: block;
    clear: both;
`;
