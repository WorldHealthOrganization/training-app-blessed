import React from "react";
import ReactMarkdown from "react-markdown";
import ReactMde, { getDefaultToolbarCommands } from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import styled from "styled-components";
import { allFilesMimeType } from "../../../utils/files";
import { addNoteCommand } from "./AddNoteCommand";
import { saveFileCommand } from "./SaveFileCommand";

export interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    onUpload?: (data: ArrayBuffer) => Promise<string | undefined>;
    markdownPreview?: (markdown: string) => React.ReactNode;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
    value,
    onChange,
    onUpload,
    markdownPreview = defaultPreviewMarkdown,
}) => {
    const saveImage = async function* (data: ArrayBuffer) {
        if (!onUpload) return false;

        const url = await onUpload(data);
        if (!url) return false;

        yield url;
        return true;
    };

    return (
        <Container>
            <Children>
                <ReactMde
                    value={value}
                    onChange={onChange}
                    paste={onUpload ? { saveImage, command: "save-file", accept: allFilesMimeType } : undefined}
                    commands={{ "add-note": addNoteCommand, "save-file": saveFileCommand }}
                    toolbarCommands={[...getDefaultToolbarCommands(), ["add-note"]]}
                    minEditorHeight={500}
                    disablePreview={true}
                />
            </Children>
            <Children>{markdownPreview(value)}</Children>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;

    textarea,
    button {
        outline: 0px;
    }

    .mde-tabs {
        display: none !important;
    }
`;

const Children = styled.div`
    height: 100%;
    max-height: 100%;
    min-height: 100%;
    width: 49%;
`;

const defaultPreviewMarkdown = (markdown: string) => <ReactMarkdown source={markdown} />;
