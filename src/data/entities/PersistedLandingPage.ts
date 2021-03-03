import { TranslatableText } from "../../domain/entities/TranslatableText";

export interface PersistedLandingPage {
    id: string;
    parent: string;
    type: "page-group" | "page" | "module-group" | "module";
    name: TranslatableText;
    icon?: string;
    title?: TranslatableText;
    description?: TranslatableText;
}

export interface LandingPageStorage {
    id: string;
    items: PersistedLandingPage[];
}
