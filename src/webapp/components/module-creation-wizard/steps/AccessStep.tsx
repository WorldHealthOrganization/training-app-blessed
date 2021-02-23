import React from "react";
import i18n from "@eyeseetea/d2-ui-components/locales";
import { ModuleCreationWizardStepProps } from "./index";
import { Sharing, ShareUpdate, SharingRule } from "@eyeseetea/d2-ui-components";
import { SharingSetting } from "../../../../domain/entities/Ref";
import { makeStyles } from "@material-ui/core/styles";
import { useAppContext } from "../../../contexts/app-context";
export const AccessStep: React.FC<ModuleCreationWizardStepProps> = ({
    module,
    onChange,
}: ModuleCreationWizardStepProps) => {
    const { usecases } = useAppContext();
    const classes = useStyles();
    const moduleName = module.name.referenceValue || "-";
    const showOptions = {
        title: false,
        dataSharing: true,
        publicSharing: false,
        externalSharing: false,
        permissionPicker: false,
    };
    const metaObject = {
        meta: { allowPublicAccess: false, allowExternalAccess: false },
        object: {
            id: module.id,
            displayName: module.name.referenceValue,
            userAccesses: mapSharingRules(module.userAccesses),
            userGroupAccesses: mapSharingRules(module.userGroupAccesses),
        },
    };
    const search = (query: string) => usecases.instance.searchUsers(query);
    const setModuleSharing = React.useCallback(
        ({ userAccesses, userGroupAccesses }: ShareUpdate) => {
            onChange(module => {
                return {
                    ...module,
                    userAccesses: userAccesses ? mapSharingSettings(userAccesses) : module.userAccesses,
                    userGroupAccesses: userGroupAccesses
                        ? mapSharingSettings(userGroupAccesses)
                        : module.userGroupAccesses,
                };
            });
            return Promise.resolve();
        },
        [onChange]
    );
    //should this be separated into its own component? However it is very similar to PermissionsDialog except that I don't want it as a popup dialog
    return (
        <React.Fragment>
            <Sharing meta={metaObject} showOptions={showOptions} onSearch={search} onChange={setModuleSharing} />
            {/* should this not be added because it doesn't seem like there are specific permissions to edit a module? */}
            <div className={classes.footer}>
                {i18n.t(
                    "Note: only users with permissions in the selected module ({{moduleName}}) can be added to this module",
                    { nsSeparator: false, moduleName }
                )}
            </div>
        </React.Fragment>
    );
};
const useStyles = makeStyles({
    footer: { marginTop: 10, marginBottom: 15, fontSize: "1.1em", textAlign: "left" },
});
//should this go to an entity file or somewhere else for functions that are used in other places like PermissionsDialog?
const mapSharingSettings = (settings?: SharingRule[]): SharingSetting[] | undefined => {
    return settings?.map(item => {
        return { id: item.id, access: item.access, name: item.displayName };
    });
};
const mapSharingRules = (settings?: SharingSetting[]): SharingRule[] | undefined => {
    return settings?.map(item => {
        return { id: item.id, access: item.access, displayName: item.name };
    });
};
