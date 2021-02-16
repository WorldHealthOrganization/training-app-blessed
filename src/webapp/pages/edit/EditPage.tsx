import React from "react";
import { DhisPage } from "../dhis-page/DhisPage";

export interface EditPageProps {
    edit: boolean;
}

export const EditPage: React.FC<EditPageProps> = () => {
    return <DhisPage></DhisPage>;
};
