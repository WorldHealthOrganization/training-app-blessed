import { Instance } from "./Instance";
import { User } from "./User";

export interface Config {
    instance: Instance;
    currentUser: User;
}
