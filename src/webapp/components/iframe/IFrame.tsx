import { useLoading } from "d2-ui-components";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

export const IFrame: React.FC<IFrameProps> = ({ className, src, title = "IFrame" }) => {
    const ref = useRef<HTMLIFrameElement>(null);
    const loading = useLoading();

    useEffect(() => {
        loading.show();
        if (!ref.current) loading.hide();
        else ref.current.addEventListener("load", () => loading.hide());
    }, [loading]);

    return (
        <StyledIFrame
            className={className}
            ref={ref}
            src={src}
            title={title}
            style={{ width: "100%", height: "100%" }}
            frameBorder="0"
        />
    );
};

export interface IFrameProps {
    src: string;
    title?: string;
    className?: string;
}

const StyledIFrame = styled.iframe`
    position: absolute;
`;
