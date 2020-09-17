import { useLoading } from "d2-ui-components";
import _ from "lodash";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { log } from "../../../utils/debug";

export interface IFrameProps {
    src: string;
    title?: string;
    className?: string;
}

const findXPath = (document: any, xpath: string) =>
    document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
        .singleNodeValue;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const waitForText = async (document: any, text: string, retry = 0): Promise<any> => {
    const element = findXPath(document, `//text()[contains(.,'${text}')]`);
    if (element || retry < 0 || retry > 15) return element;
    await sleep(100);
    return waitForText(document, text, retry + 1);
};

const textSelector = async (document: any, text: string, action = _.noop, error = _.noop) => {
    const element = await waitForText(document, text);
    if (element) action(element);
    else error(element);
    return element;
};

export const IFrame: React.FC<IFrameProps> = ({ className, src, title = "IFrame" }) => {
    const ref = useRef<HTMLIFrameElement>(null);
    const loading = useLoading();

    useEffect(() => {
        loading.show();
        if (!ref.current) return;
        ref.current.addEventListener("load", () => loading.hide());
        ref.current.addEventListener("click", () => loading.hide());

        sleep(2000);
        const { contentWindow, contentDocument } = ref.current;
        const { document = contentDocument } = contentWindow ?? {};
        textSelector(document, "Welcome Alexis RICO", log);
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

const StyledIFrame = styled.iframe`
    position: absolute;
`;
