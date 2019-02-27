import React from "react";
import renderer from "react-test-renderer";

import { getD2Stub } from "../../../utils/testing";
import Root from "../Root";

it("renders correctly", () => {
    const props = { feedback: jest.fn(), d2: getD2Stub() };
    const tree = renderer.create(<Root {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
});
