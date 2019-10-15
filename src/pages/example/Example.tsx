import React, { useState, useContext, useEffect } from "react";
import i18n from "../../locales";
import { useSnackbar } from "d2-ui-components";
import D2Api, { Id } from "d2-api";
import { ApiContext } from "../../contexts/api-context";

interface ExampleProps {
    name: string;
}

interface DataSet {
    id: Id;
}

export default function Example(props: ExampleProps) {
    const [counter, setCounter] = useState(0);
    const [dataSets, setDataSets] = useState<DataSet[]>([]);
    const snackbar = useSnackbar();
    const api = useContext(ApiContext);

    useEffect(() => {
        async function set() {
            const dataSets = (await api.models.dataSets.get({ pageSize: 5 }).response).data.objects;
            setDataSets(dataSets);
        }
        set();
    }, []);

    return (
        <React.Fragment>
            <h2>Hello {props.name}!</h2>

            <div>
                <p>
                    This is an example component written in Typescript, you can find it in{" "}
                    <b>src/pages/example/</b>, and its test in <b>src/pages/example/__tests__</b>
                </p>
                <p>Datasets loaded: {dataSets.map(ds => ds.id).join(", ")}</p>
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
