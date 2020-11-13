import { Instance } from "../../entities/Instance";
import { User } from "../../entities/User";

export interface ConfigDataSource {
    getUser(): Promise<User>;
    getInstance(): Instance;
}
