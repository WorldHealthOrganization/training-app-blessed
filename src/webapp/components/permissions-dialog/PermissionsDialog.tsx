import { ConfirmationDialog, ShareUpdate, Sharing, SharingRule } from "@eyeseetea/d2-ui-components";
import React, { useCallback } from "react";
import { SharedProperties, SharingSetting } from "../../../domain/entities/Ref";
import i18n from "../../../locales";
import { useAppContext } from "../../contexts/app-context";

export type SharedUpdate = Partial<Pick<SharedProperties, "userAccesses" | "userGroupAccesses" | "publicAccess">>;
export type PermissionsObject = Required<SharedUpdate> & { name: string };

export interface PermissionsDialogProps {
    object: PermissionsObject;
    onChange: (sharedUpdate: SharedUpdate) => Promise<void>;
    allowPublicAccess?: boolean;
    allowExternalAccess?: boolean;
    onClose: () => void;
}

export default function PermissionsDialog({
    object,
    allowPublicAccess,
    allowExternalAccess,
    onClose,
    onChange,
}: PermissionsDialogProps) {
    const { usecases } = useAppContext();
    const search = (query: string) => usecases.instance.searchUsers(query);
    const metaObject = {
        meta: { allowPublicAccess, allowExternalAccess },
        object: {
            id: "",
            displayName: object.name,
            userAccesses: mapSharingRules(object.userAccesses),
            userGroupAccesses: mapSharingRules(object.userGroupAccesses),
        },
    };

    const onUpdateSharingOptions = useCallback(
        async ({ userAccesses, userGroupAccesses, publicAccess }: ShareUpdate) => {
            await onChange({
                userAccesses: mapSharingSettings(userAccesses),
                userGroupAccesses: mapSharingSettings(userGroupAccesses),
                publicAccess,
            });
        },
        [onChange]
    );

    return (
        <ConfirmationDialog isOpen={true} fullWidth={true} onCancel={onClose} cancelText={i18n.t("Close")}>
            <Sharing
                meta={metaObject}
                showOptions={{
                    dataSharing: false,
                    publicSharing: false,
                    externalSharing: false,
                    permissionPicker: false,
                }}
                onSearch={search}
                onChange={onUpdateSharingOptions}
            />
        </ConfirmationDialog>
    );
}
//should this go to an entity file or somewhere else for functions that are used in other places like AccessStep?
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
