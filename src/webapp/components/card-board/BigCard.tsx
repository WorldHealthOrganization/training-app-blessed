import React, { ReactNode } from "react";
import styled from "styled-components";
import { CardTitleIcon } from "./CardTitleIcon";
import { CardProgress, CardProgressText } from "./CardProgress";

const BaseCard: React.FC<BigCardProps> = ({ className, label, icon, progress, onClick, onContextMenu, disabled }) => {
    const normalizedProgress = normalizeProgress(progress);

    return (
        <div className={className} onClick={disabled ? undefined : onClick} onContextMenu={onContextMenu}>
            {progress && progress >= 100 ? <CardTitleIcon>done</CardTitleIcon> : null}
            <BigCardTitle>{label}</BigCardTitle>
            {icon ? <BigCardIcon>{icon}</BigCardIcon> : null}
            {progress !== undefined ? <CardProgressText>{`${normalizedProgress}%`}</CardProgressText> : null}
            {progress !== undefined ? <CardProgress value={normalizedProgress} max="100"></CardProgress> : null}
        </div>
    );
};

export const BigCard = styled(BaseCard)`
    background: #6d98b8;
    padding: 20px;
    border-radius: 8px;
    text-align: left;
    color: #fff;
    margin: 10px 10px 10px;
    user-select: none;
    cursor: ${({ onClick, disabled }) => (onClick && !disabled ? "pointer" : "inherit")};
`;

const normalizeProgress = (progress?: number) => {
    if (progress === undefined) return undefined;
    return Math.max(0, Math.min(100, progress));
};

export interface BigCardProps {
    className?: string;
    label: string;
    progress?: number;
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onContextMenu?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    disabled?: boolean;
    icon?: ReactNode;
}

const BigCardTitle = styled.span`
    color: #fff;
    min-height: 48px;
    font-size: 22px;
    font-size: 1.2vw;
    font-weight: 700;
    display: block;
`;

const BigCardIcon = styled.span`
    display: flex;
    place-content: center;
    margin: 20px 0px;

    img,
    svg {
        max-height: 10vw;
        user-drag: none;
    }
`;
