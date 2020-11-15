import { FormGroup, Icon, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { ObjectsTable, useSnackbar } from "d2-ui-components";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { TrainingModule } from "../../../domain/entities/TrainingModule";
import i18n from "../../../locales";
import PermissionsDialog from "../../components/permissions-dialog/PermissionsDialog";
import { useAppContext } from "../../contexts/app-context";

export const SettingsPage = () => {
    const { usecases } = useAppContext();
    const snackbar = useSnackbar();

    const [permissionsType, setPermissionsType] = useState<string | null>(null);
    const [modules, setModules] = useState<TrainingModule[]>([]);

    useEffect(() => {
        usecases.listModules().then(setModules);
    }, [usecases]);

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

            <ObjectsTable<TrainingModule>
                rows={modules}
                columns={[
                    {
                        name: "name",
                        text: "Name",
                    },
                ]}
            />
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
