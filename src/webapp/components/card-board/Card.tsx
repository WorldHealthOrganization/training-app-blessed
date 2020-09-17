import React from "react";
import styled from "styled-components";
import { CardIcon } from "./CardIcon";
import { CardProgress, CardProgressText } from "./CardProgress";
import { CardTitle } from "./CardTitle";

const BaseCard: React.FC<CardProps> = ({ className, label, progress, onClick }) => {
    const normalizedProgress = normalizeProgress(progress);

    return (
        <div className={className} onClick={onClick}>
            {progress >= 100 ? <CardIcon>done</CardIcon> : null}
            <CardTitle>{label}</CardTitle>
            <CardProgressText>{`${normalizedProgress}%`}</CardProgressText>
            <CardProgress value={normalizedProgress} max="100"></CardProgress>
        </div>
    );
};

export const Card = styled(BaseCard)`
    color: ${props => getCardColor(normalizeProgress(props.progress))};
    background: #fff;
    padding: 12px;
    border-radius: 8px;
    width: 104px;
    text-align: left;
    margin: 6px;
    user-select: none;
    cursor: ${({ onClick }) => (onClick ? "pointer" : "inherit")};
`;

const getCardColor = (progress: number) => {
    if (progress === 0) return "#C6D8E6";
    else if (progress === 100) return "#43CBCB";
    else return "#626262";
};

const normalizeProgress = (progress: number) => {
    return Math.max(0, Math.min(100, progress));
};

export interface CardProps {
    className?: string;
    label: string;
    progress: number;
    onClick?: () => void;
}
