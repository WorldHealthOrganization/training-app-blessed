// @ts-ignore
import MD5 from "md5.js";

// DHIS2 UID :: /^[a-zA-Z][a-zA-Z0-9]{10}$/
const asciiLetters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const asciiNumbers = "0123456789";
const asciiLettersAndNumbers = asciiLetters + asciiNumbers;
const range10 = Array.from(new Array(10).keys());
const uidStructure = [asciiLetters, ...range10.map(() => asciiLettersAndNumbers)];
const maxHashValue = uidStructure.map(cs => cs.length).reduce((acc, n) => acc * n, 1);

/* Return pseudo-random UID from seed string */
export function getUid(seed: string): string {
    const md5hash: string = new MD5().update(seed).digest("hex");
    const nHashChars = Math.ceil(Math.log(maxHashValue) / Math.log(16));
    const hashInteger = parseInt(md5hash.slice(0, nHashChars), 16);
    const result = uidStructure.reduce(
        (acc, chars) => {
            const { n, uid } = acc;
            const nChars = chars.length;
            const quotient = Math.floor(n / nChars);
            const remainder = n % nChars;
            const uidChar = chars[remainder];
            return { n: quotient, uid: uid + uidChar };
        },
        { n: hashInteger, uid: "" }
    );

    return result.uid;
}
