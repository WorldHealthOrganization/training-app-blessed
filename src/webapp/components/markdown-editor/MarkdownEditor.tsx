import React from "react";
import ReactMde, { getDefaultToolbarCommands } from "react-mde";
import { PasteOptions } from "react-mde/lib/definitions/types";
import "react-mde/lib/styles/css/react-mde-all.css";
import styled from "styled-components";
import { allFilesMimeType } from "../../../utils/files";
import { SimpleMarkdownViewer } from "../markdown-viewer/MarkdownViewer";
import { addNoteCommand } from "./AddNoteCommand";
import { saveFileCommand } from "./SaveFileCommand";

export interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    onUpload?: (data: ArrayBuffer, file: File) => Promise<string | undefined>;
    markdownPreview?: (markdown: string) => React.ReactNode | undefined;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
    value,
    onChange,
    onUpload,
    markdownPreview = defaultPreviewMarkdown,
}) => {
    const saveImage = async function* (data: ArrayBuffer, file: File) {
        if (!onUpload) return false;

        const url = await onUpload(data, file);
        if (!url) return false;

        yield url;
        return true;
    };

    const pasteOptions = { saveImage, command: "save-file", accept: allFilesMimeType } as PasteOptions;

    return (
        <Container>
            <Children>
                <ReactMde
                    value={value}
                    onChange={onChange}
                    paste={onUpload ? pasteOptions : undefined}
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

const defaultPreviewMarkdown = (markdown: string) => <SimpleMarkdownViewer source={markdown} />;
