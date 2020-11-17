import { useConfig } from "@dhis2/app-runtime";
import { ConfirmationDialog, ShareUpdate, Sharing, SharingRule } from "d2-ui-components";
import React, { useCallback } from "react";
import { SharedRef, SharingSetting } from "../../../domain/entities/Ref";
import i18n from "../../../locales";
import { D2Api } from "../../../types/d2-api";

interface PermissionsDialogProps {
    object: Pick<SharedRef, "name" | "userAccesses" | "userGroupAccesses" | "publicAccess">;
    onChange: (
        sharedUpdate: Partial<
            Pick<SharedRef, "userAccesses" | "userGroupAccesses" | "publicAccess">
        >
    ) => Promise<void>;
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
    // TODO: Move to data layer
    const { baseUrl } = useConfig();
    const search = useCallback(
        (query: string) => {
            const api = new D2Api({ baseUrl });
            return searchUsers(api, query);
        },
        [baseUrl]
    );

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
        <ConfirmationDialog
            isOpen={true}
            fullWidth={true}
            onCancel={onClose}
            cancelText={i18n.t("Close")}
        >
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

function searchUsers(api: D2Api, query: string) {
    const options = {
        fields: { id: true, displayName: true },
        filter: { displayName: { ilike: query } },
    };
    return api.metadata.get({ users: options, userGroups: options }).getData();
}

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
