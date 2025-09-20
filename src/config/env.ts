import dotenv from "dotenv";
dotenv.config();

const getEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) throw new Error(`Missing environment variable: ${key}`);
    return value;
};

export const ENV = {
    PORT: parseInt(getEnv("PORT")),
    MONGO_URI: getEnv("MONGO_URI"),
    JWT_SECRET: getEnv("JWT_SECRET"),
    JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN"),
};
