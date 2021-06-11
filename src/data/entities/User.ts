import _ from "lodash";
import { BaseMetadata, NamedRef } from "../../domain/entities/Ref";

export interface User {
    id: string;
    name: string;
    username: string;
    userRoles: UserRole[];
    userGroups: NamedRef[];
}

export interface UserRole extends NamedRef {
    authorities: string[];
}

export const validateUserPermission = (
    item: Pick<BaseMetadata, "user" | "publicAccess" | "userAccesses" | "userGroupAccesses">,
    permission: "read" | "write",
    currentUser: User
) => {
    const { user, publicAccess = "--------", userAccesses = [], userGroupAccesses = [] } = item;
    const token = permission === "read" ? "r" : "w";

    const isAdmin = isSuperAdmin(currentUser);

    const isUserOwner = user.id === currentUser?.id;
    const isPublic = publicAccess.substring(0, 2).includes(token);

    const hasUserAccess = !!_(userAccesses)
        .filter(({ access }) => access.substring(0, 2).includes(token))
        .find(({ id }) => id === currentUser?.id);

    const hasGroupAccess =
        _(userGroupAccesses)
            .filter(({ access }) => access.substring(0, 2).includes(token))
            .intersectionBy(currentUser?.userGroups || [], "id")
            .value().length > 0;

    return isAdmin || isUserOwner || isPublic || hasUserAccess || hasGroupAccess;
};

export const isSuperAdmin = (user: User): boolean => {
    return _.flatMap(user.userRoles, ({ authorities }) => authorities).includes("ALL");
};
