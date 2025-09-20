export const parseDuration = (value: string) => {
    const num = parseInt(value);
    if (value.endsWith("s")) return num;
    if (value.endsWith("m")) return num * 60;
    if (value.endsWith("h")) return num * 3600;
    if (value.endsWith("d")) return num * 86400;
    return num;
};