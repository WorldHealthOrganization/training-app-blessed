import styled from "styled-components";

export const ModalParagraph = styled.span<{ size?: number; align?: "center" | "left" | "right" }>`
    display: block;
    font-size: ${props => props.size ?? 18}px;
    font-weight: 300;
    line-height: 28px;
    margin: 20px 0px;
    text-align: ${props => props.align ?? "unset"};
`;
