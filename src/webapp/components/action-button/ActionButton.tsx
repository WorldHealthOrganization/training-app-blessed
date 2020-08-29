import { Fab } from "@material-ui/core";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import React from "react";
import css from "styled-jsx/macro";
import i18n from "../../../locales";

export interface ActionButtonProps {
    onClick: () => void;
}

const { className, styles } = css.resolve`
    .MuiFab-root {
        position: fixed;
        margin: 10px;
        bottom: 20px;
        right: 40px;
        display: inline-flex;
        align-items: center;
        color: #fff;
        padding: 15px 20px;
        background-color: #3c8dbc;
        border-color: #367fa9;
        border-radius: 100px;
        cursor: pointer;
    }
    .MuiFab-root svg {
        margin-right: 6px;
    }
`;

export const ActionButton: React.FC<ActionButtonProps> = ({ onClick }) => {
    return (
        <Fab
            className={className}
            variant="extended"
            size="large"
            color="primary"
            onClick={onClick}
        >
            <EmojiObjectsIcon />
            <p>{i18n.t("Tutorial")}</p>
            {styles}
        </Fab>
    );
};
