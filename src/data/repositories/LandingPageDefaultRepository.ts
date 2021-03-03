import { LandingNode } from "../../domain/entities/LandingPage";
import { ConfigRepository } from "../../domain/repositories/ConfigRepository";
import { LandingPageRepository } from "../../domain/repositories/LandingPageRepository";
import { DataStoreStorageClient } from "../clients/storage/DataStoreStorageClient";
import { Namespaces } from "../clients/storage/Namespaces";
import { StorageClient } from "../clients/storage/StorageClient";

export class LandingPageDefaultRepository implements LandingPageRepository {
    private storageClient: StorageClient;

    constructor(config: ConfigRepository) {
        this.storageClient = new DataStoreStorageClient("global", config.getInstance());
    }

    public async list(): Promise<LandingNode[]> {
        try {
            const pages = await this.storageClient.listObjectsInCollection<LandingNode>(Namespaces.LANDING_PAGES);

            return pages;
        } catch (error) {
            return [];
        }
    }

    public async get(key: string): Promise<LandingNode | undefined> {
        const page = await this.storageClient.getObjectInCollection<LandingNode>(Namespaces.TRAINING_MODULES, key);
        return page;
    }
}
