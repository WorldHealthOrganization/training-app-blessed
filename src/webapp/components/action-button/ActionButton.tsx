import { Fab } from "@material-ui/core";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import React from "react";
import styled from "styled-components";
import i18n from "../../../locales";

export interface ActionButtonProps {
    onClick: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ onClick }) => {
    return (
        <StyledFab variant="extended" size="large" color="primary" onClick={onClick}>
            <EmojiObjectsIcon />
            <p>{i18n.t("Tutorial")}</p>
        </StyledFab>
    );
};

const StyledFab = styled(Fab)`
    position: fixed;
    margin: 10px;
    bottom: 20px;
    right: 40px;
    display: inline-flex;
    cursor: pointer;
    align-items: center;
    padding: 15px 20px;
    color: #fff;
    background-color: #3c8dbc;
    border-color: #367fa9;
    border-radius: 100px;

    :hover {
        background-color: #296282;
    }

    svg {
        margin-right: 6px;
    }
`;
