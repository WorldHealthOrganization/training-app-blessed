export interface UserSearchItem {
    id: string;
    displayName: string;
}

export interface UserSearch {
    users: UserSearchItem[];
    userGroups: UserSearchItem[];
}
