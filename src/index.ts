import express, { Application, NextFunction, Request, Response } from "express";
import { ENV } from "./config/env";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db";
import logger from "./utils/logger";
import router from "./routes";
import { notFound } from "./middlewares/not-found";

const PORT = ENV.PORT;

const app: Application = express();

app.use(express.json());

// Middlewares
app.use(
    cors({
        origin: ["http://localhost:3000", "https://interest-free-loan-portal.vercel.app"],
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

// Connect DB
connectDB();

//api routes
app.use('/api/v1', router)

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    res.status(err.status || 500).json(err);
});

//handle not found
app.use(notFound)

app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
