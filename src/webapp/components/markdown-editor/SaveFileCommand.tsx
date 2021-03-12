import { Command, CommandContext, ExecuteOptions, PasteCommandContext } from "react-mde";
import i18n from "../../../locales";

function dataTransferToArray(items: DataTransferItemList): Array<File> {
    const result = [];
    for (const index in items) {
        const item = items[index];
        if (item && item.kind === "file") {
            const file = item.getAsFile();
            if (file !== null) result.push(file);
        }
    }
    return result;
}

function fileListToArray(list: FileList | null): Array<File> {
    if (list === null) return [];

    const result = [];
    for (let i = 0; i < list.length; i++) {
        const item = list[0];
        if (item) result.push(item);
    }
    return result;
}

export const saveFileCommand: Command = {
    async execute({ textApi, context }: ExecuteOptions): Promise<void> {
        if (!context) {
            throw new Error("wrong context");
        }

        const pasteContext = context as PasteCommandContext;
        const { event, saveImage } = pasteContext;

        const items = isPasteEvent(context)
            ? dataTransferToArray((event as React.ClipboardEvent).clipboardData.items)
            : isDragEvent(context)
            ? dataTransferToArray((event as React.DragEvent).dataTransfer.items)
            : fileListToArray((event as React.ChangeEvent<HTMLInputElement>).target.files);

        for (const index in items) {
            const initialState = textApi.getState();
            const breaksBeforeCount = getBreaksNeededForEmptyLineBefore(
                initialState.text,
                initialState.selection.start
            );

            const breaksBefore = Array(breaksBeforeCount + 1).join("\n");
            const placeHolder = `${breaksBefore}![${i18n.t("Uploading image...")}]()`;

            textApi.replaceSelection(placeHolder);

            const blob = items[index];
            if (blob) {
                const blobContents = await readFileAsync(blob);
                const savingImage = saveImage(blobContents);
                const imageUrl = (await savingImage.next()).value;

                const newState = textApi.getState();

                const uploadingText = newState.text.substr(initialState.selection.start, placeHolder.length);

                if (uploadingText === placeHolder) {
                    // In this case, the user did not touch the placeholder. Good user
                    // we will replace it with the real one that came from the server
                    textApi.setSelectionRange({
                        start: initialState.selection.start,
                        end: initialState.selection.start + placeHolder.length,
                    });

                    const realImageMarkdown = imageUrl ? `${breaksBefore}![image](${imageUrl})` : "";
                    const selectionDelta = realImageMarkdown.length - placeHolder.length;

                    textApi.replaceSelection(realImageMarkdown);
                    textApi.setSelectionRange({
                        start: newState.selection.start + selectionDelta,
                        end: newState.selection.end + selectionDelta,
                    });
                }
            }
        }
    },
};

function isPasteEvent(context: CommandContext): context is PasteCommandContext {
    return ((context as PasteCommandContext).event as React.ClipboardEvent).clipboardData !== undefined;
}

function isDragEvent(context: CommandContext): context is PasteCommandContext {
    return ((context as PasteCommandContext).event as React.DragEvent).dataTransfer !== undefined;
}

/**
 * Reads a file and returns an ArrayBuffer
 * @param file
 */
async function readFileAsync(file: Blob): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === "string") {
                throw new Error("reader.result is expected to be an ArrayBuffer");
            } else if (reader.result === null) {
                throw new Error("reader.result is null");
            }
            resolve(reader.result);
        };

        reader.onerror = reject;

        reader.readAsArrayBuffer(file);
    });
}

function getBreaksNeededForEmptyLineBefore(text = "", startPosition: number): number {
    if (startPosition === 0) return 0;

    // rules:
    // - If we're in the first line, no breaks are needed
    // - Otherwise there must be 2 breaks before the previous character. Depending on how many breaks exist already, we
    //      may need to insert 0, 1 or 2 breaks

    let neededBreaks = 2;
    let isInFirstLine = true;
    for (let i = startPosition - 1; i >= 0 && neededBreaks >= 0; i--) {
        switch (text.charCodeAt(i)) {
            case 32: // blank space
                continue;
            case 10: // line break
                neededBreaks--;
                isInFirstLine = false;
                break;
            default:
                return neededBreaks;
        }
    }
    return isInFirstLine ? 0 : neededBreaks;
}
