import { NamedRef } from "../../domain/entities/Ref";

export interface User {
    id: string;
    name: string;
    username: string;
    userRoles: NamedRef[];
}
