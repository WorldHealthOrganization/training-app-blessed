import React from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import { ModalContent } from "../../modal/ModalContent";

export const GeneralInfoStep = () => {
    const input =
        "# This is a header\n\nAnd this is a paragraph\n\nAnd a **bold** text\n\n<p align='right'>This is right aligned</p>\n\n![alt text](http://qnimate.com/wp-content/uploads/2014/03/images2.jpg)";

    return (
        <ModalContent>
            <Markdown source={input} escapeHtml={false} />
        </ModalContent>
    );
};

const Markdown = styled(ReactMarkdown)`
    color: white;
    padding: 0 20px 0 20px;

    h1 {
        font-size: 36px;
        line-height: 47px;
        font-weight: 300;
        margin: 0px 0px 30px 0px;
    }

    p {
        font-size: 18px;
        font-weight: 300;
        line-height: 28px;
    }

    img {
        width: 100%;
    }
`;
