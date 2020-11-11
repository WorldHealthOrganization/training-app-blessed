import { Config } from "../../entities/Config";

export interface ConfigDataSource {
    get(): Promise<Config>;
}
