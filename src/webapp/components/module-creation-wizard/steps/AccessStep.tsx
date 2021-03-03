import { ShareUpdate, Sharing, SharingRule } from "@eyeseetea/d2-ui-components";
import React, { useCallback } from "react";
import styled from "styled-components";
import { SharingSetting } from "../../../../domain/entities/Ref";
import i18n from "../../../../locales";
import { useAppContext } from "../../../contexts/app-context";
import { ModuleCreationWizardStepProps } from "./index";

export const AccessStep: React.FC<ModuleCreationWizardStepProps> = ({
    module,
    onChange,
}: ModuleCreationWizardStepProps) => {
    const { usecases } = useAppContext();

    const search = useCallback((query: string) => usecases.instance.searchUsers(query), [usecases]);

    const setModuleSharing = useCallback(
        ({ publicAccess, userAccesses, userGroupAccesses }: ShareUpdate) => {
            onChange(module => {
                return {
                    ...module,
                    publicAccess: publicAccess ?? module.publicAccess,
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

    return (
        <React.Fragment>
            <Sharing
                meta={{
                    meta: { allowPublicAccess: true, allowExternalAccess: false },
                    object: {
                        id: module.id,
                        displayName: module.name.referenceValue,
                        publicAccess: module.publicAccess,
                        userAccesses: mapSharingRules(module.userAccesses),
                        userGroupAccesses: mapSharingRules(module.userGroupAccesses),
                    },
                }}
                showOptions={{
                    title: false,
                    dataSharing: false,
                    publicSharing: true,
                    externalSharing: false,
                    permissionPicker: true,
                }}
                onSearch={search}
                onChange={setModuleSharing}
            />

            <Footer>
                {i18n.t("Note: The sharing settings are only applied to the current module", { nsSeparator: false })}
            </Footer>
        </React.Fragment>
    );
};

const Footer = styled.div`
    margin-top: 10px;
    margin-bottom: 15px;
    font-size: 1.1.em;
    text-align: left;
`;

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
