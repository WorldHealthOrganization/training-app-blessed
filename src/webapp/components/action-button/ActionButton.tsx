import { Fab } from "@material-ui/core";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import React, { useCallback, useState } from "react";
import Draggable from "react-draggable";
import styled from "styled-components";
import i18n from "../../../locales";
import { wait } from "../../../utils/promises";

export interface ActionButtonProps {
    onClick: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ onClick }) => {
    const [isDragging, setDragging] = useState<boolean>(false);

    const onDrag = useCallback(() => {
        setDragging(true);
    }, []);

    const onStop = useCallback(() => {
        // Workaround to prevent click on dragging the button
        wait(250).then(() => setDragging(false));
    }, []);

    console.log(isDragging);

    return (
        <Draggable onDrag={onDrag} onStop={onStop}>
            <StyledFab variant="extended" size="large" color="primary" onClick={isDragging ? undefined : onClick}>
                <EmojiObjectsIcon />
                <p>{i18n.t("Tutorial")}</p>
            </StyledFab>
        </Draggable>
    );
};

const StyledFab = styled(Fab)`
    position: fixed;
    margin: 6px;
    bottom: 20px;
    right: 40px;
    display: inline-flex;
    cursor: pointer;
    align-items: center;
    padding: 0px 20px;
    color: #fff;
    background-color: #276696;
    border-color: #367fa9;
    border-radius: 100px;

    :hover {
        background-color: #3c8dbc;
    }

    svg {
        margin-right: 6px;
    }
`;
