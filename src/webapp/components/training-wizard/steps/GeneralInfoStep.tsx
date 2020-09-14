import React from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import { ModalContent } from "../../modal/ModalContent";

export const GeneralInfoStep = () => {
    const input =
        "# This is a header\n\nAnd this is a paragraph\n\nAnd a **bold** text\n\n![alt text](http://qnimate.com/wp-content/uploads/2014/03/images2.jpg)";

    return (
        <ModalContent>
            <Markdown source={input} escapeHtml={true} skipHtml={true} />
        </ModalContent>
    );
};

const Markdown = styled(ReactMarkdown)`
    color: white;

    img {
        width: 90%;
    }
`;
