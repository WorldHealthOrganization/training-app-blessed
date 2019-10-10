import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import Example from "../Example";

test("greeting", () => {
    const component = render(<Example name="Some Name" />);
    expect(component.queryByText("Hello Some Name!")).toBeInTheDocument();
});

test("increment button", () => {
    const component = render(<Example name="Some Name" />);
    expect(component.queryByText("Counter=0")).toBeInTheDocument();
    fireEvent.click(component.getByText("+1"));
    expect(component.queryByText("Counter=1")).toBeInTheDocument();
});

test("feedback button", () => {
    const component = render(<Example name="Some Name" />);
    fireEvent.click(component.getByText("Click to show feedback"));
});
