import React from "react";
import { Route, Switch } from "react-router-dom";
import i18n from "@dhis2/d2-i18n";

const Example = () => {
    return (
        <React.Fragment>
            <p>Add your App components here</p>

            <button onClick={undefined}>{i18n.t("Click to show feedback")}</button>
        </React.Fragment>
    );
};

const Root = () => {
    return (
        <Switch>
            <Route render={Example} />
        </Switch>
    );
};

export default Root;
