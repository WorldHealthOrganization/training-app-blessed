import _ from "lodash";

// Full-fledged url regexp are extremely slow, so let's use a very simple on that covers our use-cases:
//   [Some link](http://some-link.com/path?x=1)
//   [Some link](http://some-link.com/path?x=1 "Title")
//   <img src="http://some-link.com/path?x=1">
const urlRegExp = /(https?:\/\/|\.\.\/)[^\\"\s)]+/g;

export function getUrls<T>(module: T): string[] {
    // For simplicity, process directly the JSON representation of the module
    const json = JSON.stringify(module);
    const urls = Array.from(json.matchAll(urlRegExp)).map(groups => groups[0]);
    return _(urls).compact().uniq().value();
}

export function replaceUrls<T>(module: T, urlMapping: Record<string, string>): T {
    const json = JSON.stringify(module);
    const json2 = json.replace(urlRegExp, url => urlMapping[url] || url);
    return JSON.parse(json2);
}
