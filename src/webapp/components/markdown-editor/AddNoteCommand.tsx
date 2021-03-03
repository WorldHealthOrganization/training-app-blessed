import { Command } from "react-mde";
import NotesIcon from "@material-ui/icons/Notes";
import styled from "styled-components";

const startText = `<details>
  <summary>Note</summary>
  <p>
    `;

const endText = `
  </p>
</details>`;

export const addNoteCommand: Command = {
    icon: () => <Icon />,
    execute: ({ initialState, textApi }) => {
        const { selectedText } = textApi.setSelectionRange(
            selectWord({
                text: initialState.text,
                selection: initialState.selection,
            })
        );

        const { selection } = textApi.replaceSelection(`${startText}${selectedText}${endText}`);
        textApi.setSelectionRange({
            start: selection.end - endText.length - selectedText.length,
            end: selection.end - endText.length,
        });
    },
};

const Icon = styled(NotesIcon)`
    width: 1.3em;
    height: 1.3em;
    display: inline-block;
    font-size: inherit;
    overflow: visible;
    vertical-align: -0.125em;
`;

interface Selection {
    start: number;
    end: number;
}

interface TextSection {
    text: string;
    selection: Selection;
}

function getSurroundingWord(text: string, position: number): Selection {
    if (!text) throw Error("Argument 'text' should be truthy");

    const isWordDelimiter = (c: string) => c === " " || c.charCodeAt(0) === 10;

    // leftIndex is initialized to 0 because if selection is 0, it won't even enter the iteration
    let start = 0;
    // rightIndex is initialized to text.length because if selection is equal to text.length it won't even enter the interation
    let end = text.length;

    // iterate to the left
    for (let i = position; i - 1 > -1; i--) {
        if (isWordDelimiter(text[i - 1] ?? "")) {
            start = i;
            break;
        }
    }

    // iterate to the right
    for (let i = position; i < text.length; i++) {
        if (isWordDelimiter(text[i] ?? "")) {
            end = i;
            break;
        }
    }

    return { start, end };
}

function selectWord({ text, selection }: TextSection): Selection {
    if (text && text.length && selection.start === selection.end) {
        // the user is pointing to a word
        return getSurroundingWord(text, selection.start);
    }
    return selection;
}
