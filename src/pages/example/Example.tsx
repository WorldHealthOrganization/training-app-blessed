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
            <p>Hello {props.name}!</p>
            <p>Counter={counter}</p>

            <button onClick={() => setCounter(counter + 1)}>+1</button>
            <br />
            <button onClick={() => snackbar.info("Some info")}>
                {i18n.t("Click to show feedback")}
            </button>
        </React.Fragment>
    );
}
