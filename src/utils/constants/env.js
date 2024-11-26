const getEnv = (key) => {
    const value = process.env[key];
    if (value === undefined || value === null || value === "")
        throw new Error(`Environment variable is not defined.`);
    return value;
};

export const PORT = getEnv("PORT");
export const ORIGIN = getEnv("ORIGIN")
export const URI = getEnv("URI")
export const JWT_SECRET = getEnv("JWT_SECRET");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const RESEND_API= getEnv("RESEND_API")
export const APP_ORIGIN= getEnv("APP_ORIGIN")
