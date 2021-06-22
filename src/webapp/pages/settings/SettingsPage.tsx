import { ConfirmationDialog, ConfirmationDialogProps, useLoading, useSnackbar } from "@eyeseetea/d2-ui-components";
import { FormGroup, Icon, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Permission } from "../../../domain/entities/Permission";
import { NamedRef } from "../../../domain/entities/Ref";
import {
    addPage,
    addStep,
    removePage,
    removeStep,
    updateOrder,
    updateTranslation,
} from "../../../domain/helpers/TrainingModuleHelpers";
import i18n from "../../../locales";
import { ComponentParameter } from "../../../types/utils";
import { LandingPageListTable } from "../../components/landing-page-list-table/LandingPageListTable";
import { buildListModules, ModuleListTable } from "../../components/module-list-table/ModuleListTable";
import { PageHeader } from "../../components/page-header/PageHeader";
import { PermissionsDialog, SharedUpdate } from "../../components/permissions-dialog/PermissionsDialog";
import { useAppContext } from "../../contexts/app-context";
import { DhisPage } from "../dhis/DhisPage";

export const SettingsPage: React.FC = () => {
    const { modules, landings, reload, usecases, setAppState, showAllModules, isLoading, isAdmin } = useAppContext();

    const snackbar = useSnackbar();
    const loading = useLoading();

    const [permissionsType, setPermissionsType] = useState<string | null>(null);
    const [settingsPermissions, setSettingsPermissions] = useState<Permission>();
    const [danglingDocuments, setDanglingDocuments] = useState<NamedRef[]>([]);
    const [dialogProps, updateDialog] = useState<ConfirmationDialogProps | null>(null);

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

    const cleanUpDanglingDocuments = useCallback(async () => {
        updateDialog({
            title: i18n.t("Clean-up unused documents"),
            description: (
                <ul>
                    {danglingDocuments.map(item => (
                        <li key={item.id}>{`${item.id} ${item.name}`}</li>
                    ))}
                </ul>
            ),
            onCancel: () => updateDialog(null),
            onSave: async () => {
                loading.show(true, i18n.t("Deleting dangling documents"));

                await usecases.instance.deleteDocuments(danglingDocuments.map(({ id }) => id));
                const newDanglingList = await usecases.instance.listDanglingDocuments();
                setDanglingDocuments(newDanglingList);

                snackbar.success(i18n.t("Deleted dangling documents"));
                loading.reset();
                updateDialog(null);
            },
            saveText: i18n.t("Proceed"),
        });
    }, [danglingDocuments, loading, snackbar, usecases]);

    const refreshModules = useCallback(async () => {
        usecases.instance.listDanglingDocuments().then(setDanglingDocuments);
        await reload();
    }, [reload, usecases]);

    const openAddModule = useCallback(() => {
        setAppState({ type: "CREATE_MODULE" });
    }, [setAppState]);

    const toggleShowAllModules = useCallback(async () => {
        await usecases.config.setShowAllModules(!showAllModules);
        await reload();
    }, [showAllModules, reload, usecases]);

    const tableActions: ComponentParameter<typeof ModuleListTable, "tableActions"> = useMemo(
        () => ({
            openEditModulePage: ({ id }) => {
                setAppState({ type: "EDIT_MODULE", module: id });
            },
            editContents: async ({ id, text, value }) => {
                const module = await usecases.modules.get(id);
                if (module) await usecases.modules.update(updateTranslation(module, text.key, value));
                else snackbar.error(i18n.t("Unable to update module contents"));
            },
            deleteModules: ({ ids }) => usecases.modules.delete(ids),
            resetModules: ({ ids }) => usecases.modules.resetDefaultValue(ids),
            swap: async ({ type, id, from, to }) => {
                if (type === "module") {
                    await usecases.modules.swapOrder(from, to);
                    return;
                }

                const module = await usecases.modules.get(id);
                if (module) await usecases.modules.update(updateOrder(module, from, to));
                else snackbar.error(i18n.t("Unable to move item"));
            },
            uploadFile: ({ data }) => usecases.instance.uploadFile(data),
            installApp: ({ id }) => usecases.instance.installApp(id),
            addStep: async ({ id, title }) => {
                const module = await usecases.modules.get(id);
                if (module) await usecases.modules.update(addStep(module, title));
                else snackbar.error(i18n.t("Unable to add step"));
            },
            addPage: async ({ id, step, value }) => {
                const module = await usecases.modules.get(id);
                if (module) await usecases.modules.update(addPage(module, step, value));
                else snackbar.error(i18n.t("Unable to add page"));
            },
            deleteStep: async ({ id, step }) => {
                const module = await usecases.modules.get(id);
                if (module) await usecases.modules.update(removeStep(module, step));
                else snackbar.error(i18n.t("Unable to remove step"));
            },
            deletePage: async ({ id, step, page }) => {
                const module = await usecases.modules.get(id);
                if (module) await usecases.modules.update(removePage(module, step, page));
                else snackbar.error(i18n.t("Unable to remove page"));
            },
        }),
        [usecases, setAppState, snackbar]
    );

    useEffect(() => {
        usecases.config.getSettingsPermissions().then(setSettingsPermissions);
        usecases.instance.listDanglingDocuments().then(setDanglingDocuments);
    }, [usecases]);

    useEffect(() => {
        reload();
    }, [reload]);

    return (
        <DhisPage>
            {dialogProps && <ConfirmationDialog isOpen={true} maxWidth={"lg"} fullWidth={true} {...dialogProps} />}

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

                    <ListItem button onClick={toggleShowAllModules}>
                        <ListItemIcon>
                            <Icon>{showAllModules ? "visibility" : "visibility_off"}</Icon>
                        </ListItemIcon>
                        <ListItemText
                            primary={i18n.t("Show list with modules on main landing page")}
                            secondary={
                                showAllModules
                                    ? i18n.t("A list with all the existing modules is visible")
                                    : i18n.t("The list with all the existing  modules is hidden")
                            }
                        />
                    </ListItem>

                    {isAdmin && (
                        <ListItem button disabled={danglingDocuments.length === 0} onClick={cleanUpDanglingDocuments}>
                            <ListItemIcon>
                                <Icon>delete_forever</Icon>
                            </ListItemIcon>
                            <ListItemText
                                primary={i18n.t("Clean-up unused documents")}
                                secondary={
                                    danglingDocuments.length === 0
                                        ? i18n.t("There are no unused documents to clean")
                                        : i18n.t("There are {{total}} documents available to clean", {
                                              total: danglingDocuments.length,
                                          })
                                }
                            />
                        </ListItem>
                    )}
                </Group>

                <Title>{i18n.t("Landing page")}</Title>

                <LandingPageListTable nodes={landings} isLoading={isLoading} />

                <Title>{i18n.t("Training modules")}</Title>

                <ModuleListTable
                    rows={buildListModules(modules)}
                    refreshRows={refreshModules}
                    tableActions={tableActions}
                    onActionButtonClick={openAddModule}
                    isLoading={isLoading}
                />
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
