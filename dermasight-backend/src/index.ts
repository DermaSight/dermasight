import "dotenv/config";
import { AddressInfo } from "net";
import logger from "@/utils/logger";
import { requireEnv } from "@/utils/env";
import prisma from "@/lib/prisma";

import app from "@/app";
import { Server } from "http";
import { UncaughtExceptionOrigin } from "bun";

const gracefulShutdown = (server: Server): void => {
    if (server) {
        server.close(() => {
            prisma.$disconnect();
            logger.info("✋🏻 Dermasight Backend is shutting down");
            process.exit(0);
        });

        return;
    }

    prisma.$disconnect();
    logger.warn("🚨 No server to shutdown");
    logger.info("Exiting...");
    process.exit(1);
};

const onFatal = (err: { message?: string }, extra?: string) => {
    logger.error(`🚨 Dermasight Backend failed to start: ${err.message || "Unknown error"}`);
    if (extra) logger.error(extra);
    process.exit(1);
};

const unhandledRejectionHandler = (reason: any) => onFatal(reason);

const uncaughtExceptionHandler = (err: Error, origin: UncaughtExceptionOrigin) =>
    onFatal(err, `🚨 Origin of uncaught exception: ${origin}`);

// Main Entrypoint
(async () => {
    try {
        const PORT = Number(requireEnv("PORT"));
        const HOST = process.env.HOST || "0.0.0.0";

        requireEnv("MODEL_API_URL");
        requireEnv("R2_STORAGE_URL");
        requireEnv("R2_ACCESS_KEY_ID");
        requireEnv("R2_SECRET_ACCESS_KEY");
        requireEnv("R2_BUCKET_NAME");

        const mainServer = app.listen(PORT, HOST, (err) => {
            if (err) {
                logger.error(`🚨 Dermasight Backend failed to start: ${err.message}`);
                throw err;
            }

            if (mainServer.listening) {
                const { address, port } = mainServer.address() as AddressInfo;
                logger.info(`✋🏻 Dermasight Backend is running at http://${address}:${port}`);
            }
        });

        process.on("uncaughtException", uncaughtExceptionHandler);
        process.on("unhandledRejection", unhandledRejectionHandler);
        process.on("SIGINT", () => gracefulShutdown(mainServer));
        process.on("SIGTERM", () => gracefulShutdown(mainServer));
    } catch (err) {
        logger.error(err);
        process.exit(1);
    }
})();
