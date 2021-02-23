type Id = string;
export type SearchMatchObject = { id: Id; displayName: string };
export interface SearchResult {
    users: SearchMatchObject[];
    userGroups: SearchMatchObject[];
}
