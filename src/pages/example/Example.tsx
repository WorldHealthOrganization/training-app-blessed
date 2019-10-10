import React, { useState } from "react";
import i18n from "../../locales";

interface ExampleProps {
    name: string;
}

export default function Example(props: ExampleProps) {
    const [counter, setCounter] = useState(0);

    return (
        <React.Fragment>
            <p>Hello {props.name}!</p>
            <p>Counter={counter}</p>
            <button onClick={() => setCounter(counter + 1)}>+1</button>
            <br />

            <button onClick={undefined}>{i18n.t("Click to show feedback")}</button>
        </React.Fragment>
    );
}
