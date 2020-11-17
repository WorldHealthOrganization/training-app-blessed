export const dataStoreNamespace = "training-app";
export const constantPrefix = "Training App Storage";

export type Namespace = typeof Namespaces[keyof typeof Namespaces];

export const Namespaces = {
    TRAINING_MODULES: "training-modules",
    PROGRESS: "progress",
    CONFIG: "config",
};

export const NamespaceProperties: Record<Namespace, string[]> = {
    [Namespaces.TRAINING_MODULES]: [],
    [Namespaces.PROGRESS]: [],
    [Namespaces.CONFIG]: [],
};
