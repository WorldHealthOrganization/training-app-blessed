import { ConfirmationDialog, ConfirmationDialogProps, Dropdown, useSnackbar } from "@eyeseetea/d2-ui-components";
import _ from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { generateUid } from "../../../data/utils/uid";
import { LandingNode } from "../../../domain/entities/LandingPage";
import i18n from "../../../locales";
import { useAppContext } from "../../contexts/app-context";

export const LandingPageModuleAssignDialog: React.FC<LandingPageModuleAssignDialogProps> = ({
    onSave,
    parent,
    ...props
}) => {
    const { modules, translate } = useAppContext();

    const snackbar = useSnackbar();

    const [value, setValue] = useState<string>();

    const items = useMemo(() => modules.map(({ id, name }) => ({ value: id, text: translate(name) })), [
        modules,
        translate,
    ]);

    const save = useCallback(() => {
        const { name } = modules.find(({ id }) => id === value) ?? {};
        if (!value || !name) {
            snackbar.error(i18n.t("You must select a module"));
            return;
        }

        onSave({
            id: generateUid(),
            type: "module",
            parent,
            name: {
                key: _.kebabCase(`${parent}-${value}-name`),
                referenceValue: name.referenceValue,
                translations: name.translations,
            },
            children: [],
            icon: "",
            title: undefined,
            description: undefined,
            moduleId: value,
        });
    }, [onSave, value, modules, parent]);

    return (
        <ConfirmationDialog fullWidth={true} {...props} maxWidth={"md"} onSave={save}>
            <Dropdown
                label={i18n.t("Select a module")}
                items={items}
                onChange={setValue}
                value={value}
                hideEmpty={true}
            />
        </ConfirmationDialog>
    );
};

export interface LandingPageModuleAssignDialogProps extends Omit<ConfirmationDialogProps, "onSave"> {
    onSave: (value: LandingNode) => void;
    parent: string;
}
