import React from "react";
import { HashRouter } from "react-router-dom";
import i18n from "../../../locales";
import { BasePage } from "../base/BasePage";
import { AppRoute } from "./AppRoute";
import { Switch } from "./Switch";

const userRoutes: AppRoute[] = [
    {
        key: "home",
        name: () => i18n.t("Home"),
        section: "main",
        defaultRoute: true,
        caseSensitive: false,
        path: "/",
        element: <BasePage />,
        children: [],
    },
];

export const Router = () => {
    return (
        <HashRouter>
            <Switch routes={userRoutes} />
        </HashRouter>
    );
};
