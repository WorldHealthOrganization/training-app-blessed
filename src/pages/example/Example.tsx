import React, { useState } from "react";
import i18n from "../../locales";
import { useSnackbar } from "d2-ui-components";

interface ExampleProps {
    name: string;
}

export default function Example(props: ExampleProps) {
    const [counter, setCounter] = useState(0);
    const snackbar = useSnackbar();

    return (
        <React.Fragment>
            <h2>Hello {props.name}!</h2>

            <div>
                <p>
                    This is an example component written in Typescript, you can find it in{" "}
                    <b>src/pages/example/</b>, and its test in <b>src/pages/example/__tests__</b>
                </p>
                <p>Usage example of useState, a counter:</p>
                <p>Value={counter}</p>
                <button onClick={() => setCounter(counter - 1)}>-1</button>
                &nbsp;
                <button onClick={() => setCounter(counter + 1)}>+1</button>
            </div>

            <div>
                <p>Example of d2-ui-components snackbar usage:</p>

                <button onClick={() => snackbar.info("Some info")}>
                    {i18n.t("Click to show feedback")}
                </button>
            </div>
        </React.Fragment>
    );
}
