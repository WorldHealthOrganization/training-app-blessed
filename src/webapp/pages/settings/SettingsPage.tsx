//@ts-ignore
import { HeaderBar } from "@dhis2/ui-widgets";
import {
    FormGroup,
    Icon,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField,
} from "@material-ui/core";
import { useSnackbar } from "d2-ui-components";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { ModuleListTable } from "../../components/module-list-table/ModuleListTable";
import PermissionsDialog from "../../components/permissions-dialog/PermissionsDialog";
import { useAppContext } from "../../contexts/app-context";

export const SettingsPage: React.FC = () => {
    const { usecases } = useAppContext();
    const snackbar = useSnackbar();

    const [poEditorToken, setPoEditorToken] = useState<string>();
    const [permissionsType, setPermissionsType] = useState<string | null>(null);
    const [existsPoEditorToken, setExistsPoEditorToken] = useState<boolean>(false);

    const defaultToken = existsPoEditorToken ? "HIDDEN_TOKEN" : "";

    useEffect(() => {
        usecases.config.existsPoEditorToken().then(setExistsPoEditorToken);
    }, [usecases]);

    const updateToken = useCallback(
        (event: React.ChangeEvent<{ value: string }>) => {
            usecases.config.savePoEditorToken(event.target.value);
            setPoEditorToken(event.target.value);
        },
        [usecases]
    );

    return (
        <React.Fragment>
            <HeaderBar appName={i18n.t("Training app")} />
            <Title>{i18n.t("Permissions")}</Title>

            {!!permissionsType && (
                <PermissionsDialog
                    object={{
                        name: "Access to settings",
                        publicAccess: "--------",
                        userAccesses: [],
                        userGroupAccesses: [],
                    }}
                    onChange={async () => snackbar.info("Changed")}
                    onClose={() => setPermissionsType(null)}
                />
            )}

            <TextField
                name="token"
                type="password"
                autoComplete="new-password"
                fullWidth={true}
                label={i18n.t("POEditor token")}
                value={poEditorToken ?? defaultToken}
                onChange={updateToken}
            />

            <Group row={true}>
                <ListItem button onClick={() => setPermissionsType("settings")}>
                    <ListItemIcon>
                        <Icon>settings</Icon>
                    </ListItemIcon>
                    <ListItemText
                        primary={i18n.t("Access to Settings")}
                        secondary={i18n.t("Description TODO")}
                    />
                </ListItem>
            </Group>

            <ModuleListTable />
        </React.Fragment>
    );
};

const Title = styled.h3`
    margin-top: 0;
`;

const Group = styled(FormGroup)`
    margin: 1rem;
    margin-bottom: 35px;
    margin-left: 0;
`;
