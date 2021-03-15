import _ from "lodash";
import { LandingNode, LandingNodeModel } from "../../domain/entities/LandingPage";
import { ConfigRepository } from "../../domain/repositories/ConfigRepository";
import { LandingPageRepository } from "../../domain/repositories/LandingPageRepository";
import { DataStoreStorageClient } from "../clients/storage/DataStoreStorageClient";
import { Namespaces } from "../clients/storage/Namespaces";
import { StorageClient } from "../clients/storage/StorageClient";
import { PersistedLandingPage } from "../entities/PersistedLandingPage";
import { generateUid } from "../utils/uid";
import { InstanceRepository } from "../../domain/repositories/InstanceRepository";
import { DefaultImportExport } from "./DefaultImportExport";

export class LandingPageDefaultRepository implements LandingPageRepository {
    private storageClient: StorageClient;


    constructor(config: ConfigRepository, private instanceRepository: InstanceRepository) {
        this.storageClient = new DataStoreStorageClient("global", config.getInstance());

    }

    public async list(): Promise<LandingNode[]> {
        try {
            const persisted = await this.storageClient.listObjectsInCollection<PersistedLandingPage>(
                Namespaces.LANDING_PAGES
            );

            const root = persisted?.find(({ parent }) => parent === "none");

            if (persisted.length === 0 || !root) {
                const root = {
                    id: generateUid(),
                    parent: "none",
                    type: "root" as const,
                    icon: "",
                    order: undefined,
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

            const validation = LandingNodeModel.decode(buildDomainLandingNode(root, persisted));

            if (validation.isLeft()) {
                throw new Error(validation.extract());
            }

            return _.compact([validation.toMaybe().extract()]);
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    private getDefaultImportExport() {
        return new DefaultImportExport(this.instanceRepository);
    }

    public async saveDataStore(model: PersistedLandingPage) {
        await this.storageClient.saveObjectInCollection<PersistedLandingPage>(Namespaces.LANDING_PAGES, {
            ...model
        });
    }

    public async export(ids: string[]): Promise<void> {
        //format data properly and THEN pass the data to the function
        const nodes = await this.storageClient.listObjectsInCollection<PersistedLandingPage>(Namespaces.LANDING_PAGES);
        const toExport = _(nodes)
        .filter(({ id }) => ids.includes(id))
        .map(node => LandingNodeModel.decode(buildDomainLandingNode(node, nodes)).toMaybe().extract())
        .compact()
        .value();
        return this.getDefaultImportExport().export(toExport, "landing-page-");
    }

   /*public async import(files: File[]): Promise<PersistedLandingPage[]> {
        return this.getDefaultImportExport().import(files);
    }*/

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

const buildDomainLandingNode = (root: PersistedLandingPage, items: PersistedLandingPage[]): LandingNode => {
    return {
        ...root,
        children: _(items)
            .filter(({ parent }) => parent === root.id)
            .sortBy(item => item.order ?? 1000)
            .map((node, order) => ({ order, ...buildDomainLandingNode(node, items) }))
            .value(),
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
