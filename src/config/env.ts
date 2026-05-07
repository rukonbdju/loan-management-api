import dotenv from "dotenv";
dotenv.config();

const getEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) throw new Error(`Missing environment variable: ${key}`);
    return value;
};

export const ENV = {
    PORT: getEnv("PORT"),
    MONGO_URI: getEnv("MONGO_URI"),
    JWT_SECRET: getEnv("JWT_SECRET"),
    JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN"),
    MODE: getEnv("MODE"),
    GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
    GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET"),
    GOOGLE_REDIRECT_URI: getEnv("GOOGLE_REDIRECT_URI"),
    CLIENT_URL: getEnv("CLIENT_URL"),
};
