import FileType from "file-type/browser";
import _ from "lodash";
import { Command, CommandContext, ExecuteOptions, PasteCommandContext } from "react-mde";
import i18n from "../../../locales";

function dataTransferToArray(items: DataTransferItemList): Array<File> {
    return _(items)
        .map(item => {
            if (item.kind !== "file") return undefined;
            return item.getAsFile();
        })
        .compact()
        .value();
}

function fileListToArray(list: FileList | null): Array<File> {
    return _.compact(list);
}

export const saveFileCommand: Command = {
    async execute({ textApi, context }: ExecuteOptions): Promise<void> {
        if (!context) throw new Error("Context not defined");
        const { event, saveImage } = context as PasteCommandContext;

        const items = isPasteEvent(context)
            ? dataTransferToArray((event as React.ClipboardEvent).clipboardData.items)
            : isDragEvent(context)
            ? dataTransferToArray((event as React.DragEvent).dataTransfer.items)
            : fileListToArray((event as React.ChangeEvent<HTMLInputElement>).target.files);

        for (const blob of items) {
            const initialState = textApi.getState();
            const breaksBeforeCount = getBreaksNeededForEmptyLineBefore(
                initialState.text,
                initialState.selection.start
            );

            const breaksBefore = Array(breaksBeforeCount + 1).join("\n");
            const placeHolder = `${breaksBefore}[${i18n.t("Uploading file...")}]()`;

            textApi.replaceSelection(placeHolder);

            const blobContents = await readFileAsync(blob);
            const saveFileAction = saveImage(blobContents);
            const fileUrl = (await saveFileAction.next()).value;
            const type = await FileType.fromBuffer(blobContents);

            const newState = textApi.getState();

            const uploadingText = newState.text.substr(initialState.selection.start, placeHolder.length);

            if (uploadingText === placeHolder) {
                // In this case, the user did not touch the placeholder. Good user
                // we will replace it with the real one that came from the server
                textApi.setSelectionRange({
                    start: initialState.selection.start,
                    end: initialState.selection.start + placeHolder.length,
                });

                const isImage = type?.mime.startsWith("image/");
                const imageMark = isImage ? "!" : "";
                const realMarkdown = fileUrl ? `${breaksBefore}${imageMark}[Uploaded file](${fileUrl})` : "";
                const selectionDelta = realMarkdown.length - placeHolder.length;

                textApi.replaceSelection(realMarkdown);
                textApi.setSelectionRange({
                    start: newState.selection.start + selectionDelta,
                    end: newState.selection.end + selectionDelta,
                });
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
