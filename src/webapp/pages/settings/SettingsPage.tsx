import { FormGroup, Icon, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { useSnackbar } from "d2-ui-components";
import React, { useState } from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import PermissionsDialog from "../../components/permissions-dialog/PermissionsDialog";

export const SettingsPage = () => {
    const snackbar = useSnackbar();
    const [permissionsType, setPermissionsType] = useState<string | null>(null);

    return (
        <React.Fragment>
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
