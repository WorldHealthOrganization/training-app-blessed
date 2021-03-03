export const dataStoreNamespace = "training-app";
export const constantPrefix = "Training App Storage";

export type Namespace = typeof Namespaces[keyof typeof Namespaces];

export const Namespaces = {
    TRAINING_MODULES: "training-modules",
    LANDING_PAGES: "landing-pages",
    PROGRESS: "progress",
    CONFIG: "config",
};

export const NamespaceProperties: Record<Namespace, string[]> = {
    [Namespaces.TRAINING_MODULES]: [],
    [Namespaces.LANDING_PAGES]: [],
    [Namespaces.PROGRESS]: [],
    [Namespaces.CONFIG]: [],
};
