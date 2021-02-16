import { ConfirmationDialog } from "@eyeseetea/d2-ui-components";
import { FormGroup, Icon, ListItem, ListItemIcon, ListItemText, TextField } from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Permission } from "../../../domain/entities/Permission";
import i18n from "../../../locales";
import { ModuleListTable } from "../../components/module-list-table/ModuleListTable";
import { PageHeader } from "../../components/page-header/PageHeader";
import PermissionsDialog, { SharedUpdate } from "../../components/permissions-dialog/PermissionsDialog";
import { useAppContext } from "../../contexts/app-context";
import { DhisPage } from "../dhis/DhisPage";

export const SettingsPage: React.FC = () => {
    const { usecases, setAppState } = useAppContext();

    const [poEditorToken, setPoEditorToken] = useState<string>();
    const [permissionsType, setPermissionsType] = useState<string | null>(null);
    const [existsPoEditorToken, setExistsPoEditorToken] = useState<boolean>(false);
    const [isPOEditorDialogOpen, setPOEditorDialogOpen] = useState(false);
    const [settingsPermissions, setSettingsPermissions] = useState<Permission>();

    const defaultToken = existsPoEditorToken ? "HIDDEN_TOKEN" : "";

    const updateToken = useCallback(
        (event: React.ChangeEvent<{ value: string }>) => {
            usecases.config.savePoEditorToken(event.target.value);
            setPoEditorToken(event.target.value);
        },
        [usecases]
    );

    const openTraining = useCallback(() => {
        setAppState({ type: "HOME" });
    }, [setAppState]);

    const updateSettingsPermissions = useCallback(
        async ({ userAccesses, userGroupAccesses }: SharedUpdate) => {
            await usecases.config.updateSettingsPermissions({
                users: userAccesses?.map(({ id, name }) => ({ id, name })),
                userGroups: userGroupAccesses?.map(({ id, name }) => ({ id, name })),
            });

            const newSettings = await usecases.config.getSettingsPermissions();
            setSettingsPermissions(newSettings);
        },
        [usecases]
    );

    const buildSharingDescription = useCallback(() => {
        const users = settingsPermissions?.users?.length ?? 0;
        const userGroups = settingsPermissions?.userGroups?.length ?? 0;

        if (users > 0 && userGroups > 0) {
            return i18n.t("Accessible to {{users}} users and {{userGroups}} user groups", {
                users,
                userGroups,
            });
        } else if (users > 0) {
            return i18n.t("Accessible to {{users}} users", { users });
        } else if (userGroups > 0) {
            return i18n.t("Accessible to {{userGroups}} user groups", { userGroups });
        } else {
            return i18n.t("Only accessible to system administrators");
        }
    }, [settingsPermissions]);

    useEffect(() => {
        usecases.config.existsPoEditorToken().then(setExistsPoEditorToken);
    }, [usecases]);

    useEffect(() => {
        usecases.config.getSettingsPermissions().then(setSettingsPermissions);
    }, [usecases]);

    return (
        <DhisPage>
            {!!permissionsType && (
                <PermissionsDialog
                    object={{
                        name: "Access to settings",
                        publicAccess: "--------",
                        userAccesses:
                            settingsPermissions?.users?.map(ref => ({
                                ...ref,
                                access: "rw----",
                            })) ?? [],
                        userGroupAccesses:
                            settingsPermissions?.userGroups?.map(ref => ({
                                ...ref,
                                access: "rw----",
                            })) ?? [],
                    }}
                    onChange={updateSettingsPermissions}
                    onClose={() => setPermissionsType(null)}
                />
            )}

            <ConfirmationDialog
                isOpen={isPOEditorDialogOpen}
                title={i18n.t("Connection with POEditor")}
                onCancel={() => setPOEditorDialogOpen(false)}
                cancelText={i18n.t("Close")}
                maxWidth={"md"}
                fullWidth={true}
            >
                <form>
                    <TextField
                        name="token"
                        type="password"
                        autoComplete="new-password"
                        fullWidth={true}
                        label={i18n.t("POEditor token")}
                        value={poEditorToken ?? defaultToken}
                        onChange={updateToken}
                    />
                </form>
            </ConfirmationDialog>

            <Header title={i18n.t("Settings")} onBackClick={openTraining} />

            <Container>
                <Title>{i18n.t("Permissions")}</Title>

                <Group row={true}>
                    <ListItem button onClick={() => setPermissionsType("settings")}>
                        <ListItemIcon>
                            <Icon>settings</Icon>
                        </ListItemIcon>
                        <ListItemText primary={i18n.t("Access to Settings")} secondary={buildSharingDescription()} />
                    </ListItem>
                    <ListItem button onClick={() => setPOEditorDialogOpen(true)}>
                        <ListItemIcon>
                            <Icon>translate</Icon>
                        </ListItemIcon>
                        <ListItemText
                            primary={i18n.t("Connection with POEditor")}
                            secondary={i18n.t("Connect the application with POEditor to sync translations")}
                        />
                    </ListItem>
                </Group>

                <Title>{i18n.t("Training modules")}</Title>

                <ModuleListTable />
            </Container>
        </DhisPage>
    );
};

const Title = styled.h3`
    margin-top: 25px;
`;

const Group = styled(FormGroup)`
    margin-bottom: 35px;
    margin-left: 0;
`;

const Container = styled.div`
    margin: 1.5rem;
`;

const Header = styled(PageHeader)`
    margin-top: 1rem;
`;
