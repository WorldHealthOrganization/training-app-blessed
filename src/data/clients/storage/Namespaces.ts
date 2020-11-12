export const dataStoreNamespace = "training-app";
export const constantPrefix = "Training App Storage";

export type Namespace = typeof Namespace[keyof typeof Namespace];

export const Namespace = {
    TRAINING_MODULES: "training-modules",
};

export const NamespaceProperties: Record<Namespace, string[]> = {
    [Namespace.TRAINING_MODULES]: [],
};
