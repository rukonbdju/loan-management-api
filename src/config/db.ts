import mongoose from "mongoose";
import logger from "../utils/logger";
import { ENV } from "./env";

export const connectDB = async () => {
    console.log("URI: ", ENV.MONGO_URI)
    if (!ENV.MONGO_URI) {
        console.log("DB URL not fount!")
        return;
    }
    logger.info("MONGO_URL", ENV.MONGO_URI)
    try {
        await mongoose.connect(ENV.MONGO_URI);
        logger.info("MongoDB connected ✅");
    } catch (err) {
        logger.error("MongoDB connection failed ❌", err);
        process.exit(1);
    }
};
