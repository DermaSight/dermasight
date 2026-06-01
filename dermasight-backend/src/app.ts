import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import logger from "@/utils/logger";
import { requireEnv } from "@/utils/env";
import cookieParser from "cookie-parser";
import { errorMiddleware, notFoundMiddleware } from "@/middlewares/errorHandler";

import appRouters from "@/routes";

const app = express();

const COOKIE_SECRET = requireEnv("COOKIE_SECRET");
const API_PREFIX = process.env.API_PREFIX || "/api";

// Security Measures
app.disable("x-powered-by");
app.disable("etag");

// Global Middleware
app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));

const CORS_ORIGINS = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map((s) => s.trim())
    : ["http://localhost:5173", "http://127.0.0.1:5173"];

// CORS
app.use(
    cors({
        origin: CORS_ORIGINS,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    })
);

// Security Middleware
const CSP_CONNECT_SRC = [
    "'self'",
    "http://127.0.0.1:5000",
    "http://localhost:5000",
    ...CORS_ORIGINS
];

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    "https://unpkg.com",
                    "'unsafe-inline'",
                    "http://127.0.0.1:5000",
                    "http://localhost:5000"
                ],
                styleSrc: [
                    "'self'",
                    "https://unpkg.com",
                    "'unsafe-inline'",
                    "http://127.0.0.1:5000",
                    "http://localhost:5000"
                ],
                imgSrc: [
                    "'self'",
                    "data:",
                    "https://unpkg.com",
                    "http://127.0.0.1:5000",
                    "http://localhost:5000"
                ],
                connectSrc: CSP_CONNECT_SRC,
                fontSrc: [
                    "'self'",
                    "https://unpkg.com",
                    "http://127.0.0.1:5000",
                    "http://localhost:5000"
                ],
                objectSrc: ["'none'"]
            }
        }
    })
);

// Logging
app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms", {
        stream: {
            write: (message) => logger.info(message.trim())
        }
    })
);

// App Middleware
app.use(API_PREFIX, appRouters);

// Error Handler
app.use(notFoundMiddleware); // 404
app.use(errorMiddleware); // Errors

export default app;
