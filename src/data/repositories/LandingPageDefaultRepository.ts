import _ from "lodash";
import { LandingNode, PageNodeModel } from "../../domain/entities/LandingPage";
import { ConfigRepository } from "../../domain/repositories/ConfigRepository";
import { LandingPageRepository } from "../../domain/repositories/LandingPageRepository";
import { DataStoreStorageClient } from "../clients/storage/DataStoreStorageClient";
import { Namespaces } from "../clients/storage/Namespaces";
import { StorageClient } from "../clients/storage/StorageClient";
import { LandingPageStorage, PersistedLandingPage } from "../entities/PersistedLandingPage";
import { generateUid } from "../utils/uid";

export class LandingPageDefaultRepository implements LandingPageRepository {
    private storageClient: StorageClient;

    constructor(config: ConfigRepository) {
        this.storageClient = new DataStoreStorageClient("global", config.getInstance());
    }

    public async list(): Promise<LandingNode[]> {
        try {
            const pages = await this.storageClient.listObjectsInCollection<LandingPageStorage>(
                Namespaces.LANDING_PAGES
            );

            if (pages.length === 0) {
                const root = {
                    id: "root",
                    type: "page" as const,
                    name: {
                        key: "root-name",
                        referenceValue: "Main landing page",
                        translations: {},
                    },
                    icon: "",
                    title: undefined,
                    description: undefined,
                };

                await this.storageClient.saveObjectInCollection<LandingPageStorage>(Namespaces.LANDING_PAGES, {
                    id: generateUid(),
                    items: [{ ...root, parent: "root" }],
                });
                return [{ ...root, children: [] }];
            }

            return _.compact(
                pages.map(({ items }) => {
                    const root = items?.find(({ parent }) => parent === "none");
                    if (!root) return undefined;
                    return PageNodeModel.decode(buildDomainLandingNode(root, items)).toMaybe().extract();
                })
            );
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    public async get(key: string): Promise<LandingNode | undefined> {
        const pages = await this.list();
        return pages.find(({ id }) => id === key);
    }
}

const buildDomainLandingNode = (root: PersistedLandingPage, items: PersistedLandingPage[]): unknown => {
    return {
        ...root,
        children: items.filter(({ parent }) => parent === root.id).map(node => buildDomainLandingNode(node, items)),
    };
};
