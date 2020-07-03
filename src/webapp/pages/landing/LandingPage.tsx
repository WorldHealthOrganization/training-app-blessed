import React from "react";
import { useHistory } from "react-router-dom";
import i18n from "../../../locales";
import { Landing } from "./Landing";
import { MenuCardProps } from "./landing/MenuCard";

const LandingPage: React.FC = () => {
    const history = useHistory();

    const cards: {
        title: string;
        key: string;
        isVisible?: boolean;
        children: MenuCardProps[];
    }[] = [
        {
            title: "Configuration",
            key: "configuration",
            children: [
                {
                    name: i18n.t("configuration"),
                    description: "Configuration",
                    listAction: () => history.push("/for/Configuration"),
                },
            ],
        },
    ];

    return <Landing cards={cards} />;
};

export default LandingPage;
