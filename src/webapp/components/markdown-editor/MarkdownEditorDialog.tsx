import { ConfirmationDialog } from "d2-ui-components";
import React, { ReactNode, useCallback, useState } from "react";
import i18n from "../../../locales";
import { MarkdownEditor } from "./MarkdownEditor";

export interface MarkdownEditorDialogProps {
    title?: string;
    initialValue: string;
    onCancel: () => void;
    onSave: (value: string) => void;
    markdownPreview?: (markdown: string) => ReactNode;
}

export const MarkdownEditorDialog: React.FC<MarkdownEditorDialogProps> = ({
    title = i18n.t("Edit markdown"),
    initialValue,
    onCancel,
    onSave,
    markdownPreview,
}) => {
    const [value, onChange] = useState<string>(initialValue);

    const onFinish = useCallback(() => {
        onSave(value);
    }, [onSave, value]);

    const onUpload = useCallback(async (data: ArrayBuffer) => {
        // TODO: Call a usecase here
        console.log("upload", data);
        return "https://test.com/foo.png";
    }, []);

    return (
        <ConfirmationDialog
            title={title}
            isOpen={true}
            maxWidth={"lg"}
            fullWidth={true}
            onCancel={onCancel}
            onSave={onFinish}
            saveText={i18n.t("Save")}
        >
            <MarkdownEditor
                value={value}
                onChange={onChange}
                markdownPreview={markdownPreview}
                onUpload={onUpload}
            />
        </ConfirmationDialog>
    );
};
