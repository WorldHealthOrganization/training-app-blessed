import _ from "lodash";
import { LandingNode, LandingNodeModel } from "../../domain/entities/LandingPage";
import { ConfigRepository } from "../../domain/repositories/ConfigRepository";
import { LandingPageRepository } from "../../domain/repositories/LandingPageRepository";
import { DataStoreStorageClient } from "../clients/storage/DataStoreStorageClient";
import { Namespaces } from "../clients/storage/Namespaces";
import { StorageClient } from "../clients/storage/StorageClient";
import { PersistedLandingPage } from "../entities/PersistedLandingPage";

export class LandingPageDefaultRepository implements LandingPageRepository {
    private storageClient: StorageClient;

    constructor(config: ConfigRepository) {
        this.storageClient = new DataStoreStorageClient("global", config.getInstance());
    }

    public async list(): Promise<LandingNode[]> {
        try {
            const pages = await this.storageClient.listObjectsInCollection<PersistedLandingPage>(
                Namespaces.LANDING_PAGES
            );

            if (pages.length === 0) {
                const root = {
                    id: "root",
                    parent: "none",
                    type: "page" as const,
                    name: {
                        key: "root-name",
                        referenceValue: "Main landing page",
                        translations: {},
                    },
                    icon: "",
                    title: undefined,
                    description: undefined,
                    moduleId: "",
                };

                await this.storageClient.saveObjectInCollection<PersistedLandingPage>(Namespaces.LANDING_PAGES, root);
                return [{ ...root, children: [] }];
            }

            const root = pages?.find(({ parent }) => parent === "none");
            if (!root) return [];

            const validation = LandingNodeModel.decode(buildDomainLandingNode(root, pages));

            if (validation.isLeft()) {
                throw new Error(validation.extract());
            }

            return _.compact([validation.toMaybe().extract()]);
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    public async get(key: string): Promise<LandingNode | undefined> {
        const pages = await this.list();
        return pages.find(({ id }) => id === key);
    }

    public async updateChild(node: LandingNode) {
        const updatedNodes = extractChildrenNodes(node, node.parent);
        await this.storageClient.saveObjectsInCollection<PersistedLandingPage>(Namespaces.LANDING_PAGES, updatedNodes);
    }

    public async removeChild(node: LandingNode) {
        const updatedNodes = extractChildrenNodes(node, node.parent);
        await this.storageClient.removeObjectsInCollection(
            Namespaces.LANDING_PAGES,
            updatedNodes.map(({ id }) => id)
        );
    }
}

const buildDomainLandingNode = (root: PersistedLandingPage, items: PersistedLandingPage[]): unknown => {
    return {
        ...root,
        children: items.filter(({ parent }) => parent === root.id).map(node => buildDomainLandingNode(node, items)),
    };
};

const extractChildrenNodes = (node: BaseNode, parent: string): PersistedLandingPage[] => {
    const { children, ...props } = node;
    const childrenNodes = _.flatMap(children, child => (child ? extractChildrenNodes(child, node.id) : []));

    return [{ ...props, parent } as PersistedLandingPage, ...childrenNodes];
};

interface BaseNode {
    id: string;
    children: (BaseNode | undefined)[];
}
