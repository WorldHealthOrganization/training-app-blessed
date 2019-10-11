import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { SnackbarProvider } from "d2-ui-components";
import "@testing-library/jest-dom/extend-expect";

import Example from "../Example";

function getComponent({ name = "Some Name" } = {}) {
    return render(
        <SnackbarProvider>
            <Example name={name} />
        </SnackbarProvider>
    );
}

test("greeting", () => {
    const component = getComponent();
    expect(component.queryByText("Hello Some Name!")).toBeInTheDocument();
});

test("increment button", () => {
    const component = getComponent();
    expect(component.queryByText("Counter=0")).toBeInTheDocument();
    fireEvent.click(component.getByText("+1"));
    expect(component.queryByText("Counter=1")).toBeInTheDocument();
});

test("feedback button", () => {
    const component = getComponent();
    fireEvent.click(component.getByText("Click to show feedback"));
    expect(component.queryByText("Some info")).toBeInTheDocument();
});
