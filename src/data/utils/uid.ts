const abc = "abcdefghijklmnopqrstuvwxyz";
const letters = abc.concat(abc.toUpperCase());

const ALLOWED_CHARS = `0123456789${letters}`;

const NUMBER_OF_CODEPOINTS = ALLOWED_CHARS.length;
const CODESIZE = 11;

const CODE_PATTERN = /^[a-zA-Z]{1}[a-zA-Z0-9]{10}$/;

function randomWithMax(max: number) {
    return Math.floor(Math.random() * max);
}

export function generateUid(): string {
    // First char should be a letter
    let randomChars = letters.charAt(randomWithMax(letters.length));

    for (let i = 1; i < CODESIZE; i += 1) {
        randomChars += ALLOWED_CHARS.charAt(randomWithMax(NUMBER_OF_CODEPOINTS));
    }

    return randomChars;
}

export function isValidUid(code: string | undefined | null): boolean {
    return !!code && CODE_PATTERN.test(code);
}
