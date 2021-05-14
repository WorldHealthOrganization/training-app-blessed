import styled from "styled-components";
import { getColor } from "../../../themes/colors";

const SubBullet = (props: { className?: string; completed?: boolean; onClick?: () => void }) => (
    <div className={props.className} onClick={props.onClick}></div>
);

export const NavigationBullet = styled(SubBullet)`
    text-align: center;
    position: relative;

    font-weight: 700;
    border-radius: 100px;
    height: 10px;
    width: 10px;
    display: inline-block;
    line-height: 34px;
    cursor: ${props => (props.onClick ? "pointer" : "inherit")};

    background-color: ${props => (props.completed ? getColor("secondary") : "rgba(255, 255, 255, 0.3)")};
`;
