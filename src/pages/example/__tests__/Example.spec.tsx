import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { SnackbarProvider } from "d2-ui-components";
import "@testing-library/jest-dom/extend-expect";

import Example from "../Example";
import D2Api from "d2-api";
import { ApiContext } from "../../../contexts/api-context";

// Temporal, we should create a stub for D2Api

const api = new D2Api({
    baseUrl: "https://play.dhis2.org/2.32.2",
    auth: { username: "admin", password: "district" },
});

function getComponent({ name = "Some Name" } = {}) {
    return render(
        <ApiContext.Provider value={api}>
            <SnackbarProvider>
                <Example name={name} />
            </SnackbarProvider>
        </ApiContext.Provider>
    );
}

test("greeting", () => {
    const component = getComponent();
    expect(component.queryByText("Hello Some Name!")).toBeInTheDocument();
});

test("increment button", () => {
    const component = getComponent();
    expect(component.queryByText("Value=0")).toBeInTheDocument();
    fireEvent.click(component.getByText("+1"));
    expect(component.queryByText("Value=1")).toBeInTheDocument();
});

test("feedback button", () => {
    const component = getComponent();
    fireEvent.click(component.getByText("Click to show feedback"));
    expect(component.queryByText("Some info")).toBeInTheDocument();
});
