import React from "react";
import { useCurrentRoute } from "../../router/useCurrentRoute";

export const WelcomePage = () => {
    const route = useCurrentRoute();

    return <React.Fragment>{route?.name()}</React.Fragment>;
};
