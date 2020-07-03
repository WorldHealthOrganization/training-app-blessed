import { makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import i18n from "../../../locales";
import { AppDrawer, AppDrawerToggle } from "../../components/drawer/Drawer";

export interface AppRoute {
    key: string;
    path: string;
    name: () => string;
    icon: string;
    section: string;
    defaultRoute?: boolean;
    component: (props: unknown) => React.ReactElement | null;
}

export const userRoutes: AppRoute[] = [
    {
        key: "home",
        name: () => i18n.t("Home"),
        icon: "home",
        path: "/",
        section: "main",
        defaultRoute: true,
        component: () => null,
    },
    {
        key: "settings",
        name: () => i18n.t("Settings"),
        icon: "settings",
        path: "/settings",
        section: "settings",
        component: () => null,
    },
];

const Root = () => {
    const classes = useStyles();
    const [isOpen, setOpen] = useState(true);

    const defaultRoute = userRoutes.find(({ defaultRoute }) => defaultRoute) ?? userRoutes[0];

    return (
        <HashRouter>
            <div className={classes.flex}>
                <AppDrawer isOpen={isOpen} routes={userRoutes} />
                <AppDrawerToggle isOpen={isOpen} setOpen={setOpen} />

                <div
                    className={`${classes.content} ${
                        isOpen ? classes.contentOpen : classes.contentCollapsed
                    }`}
                >
                        <Switch>
                            {userRoutes.map(AppRoute)}

                            {defaultRoute && (
                                <Route
                                    exact={true}
                                    path={"/"}
                                    render={() => <Redirect to={defaultRoute.path} />}
                                />
                            )}
                        </Switch>
                </div>
            </div>
        </HashRouter>
    );
};

const AppRoute = ({ key, path, component }: AppRoute) => {
    return (
        <Route key={key} path={path}>
            {component({})}
        </Route>
    );
};

const useStyles = makeStyles({
    flex: { display: "flex" },
    header: { position: "fixed", top: 0, width: "100%", zIndex: 1 },
    content: { flexGrow: 1, height: "100%" },
    contentOpen: { marginLeft: 325 },
    contentCollapsed: { marginLeft: 25 },
});

export default Root;
