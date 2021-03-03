import _ from "lodash";
import { LandingNode, LandingNodeModel } from "../../domain/entities/LandingPage";
import { ConfigRepository } from "../../domain/repositories/ConfigRepository";
import { LandingPageRepository } from "../../domain/repositories/LandingPageRepository";
import { DataStoreStorageClient } from "../clients/storage/DataStoreStorageClient";
import { Namespaces } from "../clients/storage/Namespaces";
import { StorageClient } from "../clients/storage/StorageClient";
import { PersistedLandingPage } from "../entities/PersistedLandingPage";
import { generateUid } from "../utils/uid";

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

            const root = pages?.find(({ parent }) => parent === "none");

            if (pages.length === 0 || !root) {
                const root = {
                    id: generateUid(),
                    parent: "none",
                    type: "root" as const,
                    icon: "",
                    name: {
                        key: "root-name",
                        referenceValue: "Main landing page",
                        translations: {},
                    },
                    title: undefined,
                    content: undefined,
                    modules: [],
                };

                await this.storageClient.saveObjectInCollection<PersistedLandingPage>(Namespaces.LANDING_PAGES, root);
                return [{ ...root, children: [] }];
            }

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

    public async updateChild(node: LandingNode): Promise<void> {
        const updatedNodes = extractChildrenNodes(node, node.parent);
        await this.storageClient.saveObjectsInCollection<PersistedLandingPage>(Namespaces.LANDING_PAGES, updatedNodes);
    }

    public async removeChilds(ids: string[]): Promise<void> {
        const nodes = await this.storageClient.listObjectsInCollection<PersistedLandingPage>(Namespaces.LANDING_PAGES);
        const toDelete = _(nodes)
            .filter(({ id }) => ids.includes(id))
            .map(node => LandingNodeModel.decode(buildDomainLandingNode(node, nodes)).toMaybe().extract())
            .compact()
            .flatMap(node => [node.id, extractChildrenNodes(node, node.parent).map(({ id }) => id)])
            .flatten()
            .value();

        await this.storageClient.removeObjectsInCollection(Namespaces.LANDING_PAGES, toDelete);
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
