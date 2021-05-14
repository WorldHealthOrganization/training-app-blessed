import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import styled from "styled-components";

export const SimpleMarkdownViewer: React.FC<{ className?: string; source: string; center?: boolean }> = ({
    className,
    source,
}) => (
    <ReactMarkdown className={className} rehypePlugins={[rehypeSanitize, rehypeRaw]}>
        {source}
    </ReactMarkdown>
);

export const MarkdownViewer = styled(SimpleMarkdownViewer)`
    color: white;
    padding: 5px 20px 0 20px;
    text-align-last: ${props => (props.center ? "center" : "unset")};

    h1 {
        font-size: 32px;
        line-height: 47px;
        font-weight: 300;
        margin: 0px 0px 30px 0px;
    }

    p {
        font-size: 17px;
        font-weight: 300;
        line-height: 28px;
        text-align: justify;
    }

    img {
        max-width: 100%;
        border-radius: 1em;
        user-drag: none;
    }

    a {
        color: white;
    }

    details > summary {
        cursor: pointer;
        display: flex;
        align-items: center;
        outline: none;
        list-style: none;
        list-style-type: none;
        font-size: 33px;
        font-weight: 100;
        text-align: left;
        user-select: none;
    }

    details > summary::-webkit-details-marker {
        display: none;
    }

    details > summary::before {
        content: url(./img/note.svg);
        margin-right: 20px;
        top: 3px;
        position: relative;
    }

    details > summary::after {
        content: "keyboard_arrow_down";
        font-size: 35px;
        margin-left: 10px;
        font-family: "Material Icons";
    }

    details[open] > summary::after {
        transform: rotate(180deg);
    }
`;
