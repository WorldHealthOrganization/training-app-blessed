import _ from "lodash";

export const cacheImages = (contents: string) => {
    const images = extractImageUrls(contents);
    for (const image of images) {
        const container = new Image();
        container.src = image;
    }
};

export const extractImageUrls = (contents: string): string[] => {
    return [...extractMarkdownImages(contents), ...extractHTMLImages(contents)];
};

const extractMarkdownImages = (contents: string): string[] => {
    const regex = /!\[[^\]]*\]\((?<url>.*?)\s*(?="|\))(?<title>".*")?\)/g;
    return _(Array.from(contents.matchAll(regex)))
        .map(({ groups }) => groups?.url)
        .compact()
        .uniq()
        .value();
};

const extractHTMLImages = (contents: string): string[] => {
    const regex = /src\s*=\s*"(?<url>.+?)"/g;
    return _(Array.from(contents.matchAll(regex)))
        .map(({ groups }) => groups?.url)
        .compact()
        .uniq()
        .value();
};
