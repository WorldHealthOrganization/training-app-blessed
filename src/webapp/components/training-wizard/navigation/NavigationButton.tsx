import { Button } from "@material-ui/core";
import styled from "styled-components";

export const NavigationButton = styled(Button)`
    font-size: 18px;
    color: #fff;
    margin: 0px 20px 0 20px;
    padding: 15px 36px;
    border-radius: 100px;
    border: 0px;

    background-color: #43cbcb;
    text-transform: inherit;
    font-weight: inherit;
    line-height: inherit;

    :hover {
        background-color: #2e8e8e;
    }
`;
