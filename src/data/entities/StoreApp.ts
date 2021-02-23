export interface StoreApp {
    appType: string;
    created: Date;
    description: string;
    developer: StoreAppDeveloper;
    id: string;
    images: StoreAppImage[];
    lastUpdated: Date;
    name: string;
    owner: string;
    reviews: [];
    sourceUrl: string;
    status: string;
    versions: Version[];
}

export interface Version {
    channel: string;
    created: Date;
    demoUrl: string;
    downloadUrl: string;
    id: string;
    lastUpdated: Date;
    maxDhisVersion: string;
    minDhisVersion: string;
    version: string;
}

export interface StoreAppDeveloper {
    address: string;
    email: string;
    name: string;
    organization: string;
}

export interface StoreAppImage {
    caption: string;
    created: Date;
    description: string;
    id: string;
    imageUrl: string;
    lastUpdated: Date;
    logo: boolean;
}
