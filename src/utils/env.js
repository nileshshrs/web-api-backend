const getEnv = (key) => {
    const value = process.env[key];
    if (value === undefined || value === null || value === "")
        throw new Error(`Environment variable is not defined.`);
    return value;
};

export const PORT = getEnv("PORT");
export const ORIGIN = getEnv("ORIGIN")
export const URI = getEnv("URI")