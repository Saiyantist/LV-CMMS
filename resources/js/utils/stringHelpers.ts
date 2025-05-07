export const toTitleCase = (str: string): string =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());