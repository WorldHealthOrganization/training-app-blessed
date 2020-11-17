import { Instance } from "../../data/entities/Instance";
import { User } from "../../data/entities/User";

export interface ConfigRepository {
    getUser(): Promise<User>;
    getInstance(): Instance;
}
