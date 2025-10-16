import mongoose from "mongoose";
import logger from "../utils/logger";
import { ENV } from "./env";

export const connectDB = async () => {
    logger.info("MONGO_URL", ENV.MONGO_URI)
    try {
        await mongoose.connect(ENV.MONGO_URI);
        logger.info("MongoDB connected ✅");
    } catch (err) {
        logger.error("MongoDB connection failed ❌", err);
        process.exit(1);
    }
};
