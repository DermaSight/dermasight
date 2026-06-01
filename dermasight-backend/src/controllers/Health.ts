import { Request, Response } from "express";
import fResponse from "@/utils/responseFormatter";
import prisma from "@/lib/prisma";

const HealthController = {
    check: async (_req: Request, res: Response) => {
        let dbStatus = "unhealthy";
        try {
            await prisma.$queryRaw`SELECT 1`;
            dbStatus = "healthy";
        } catch {}

        return fResponse({
            res,
            code: dbStatus === "healthy" ? 200 : 503,
            message: dbStatus === "healthy" ? "System is Healthy" : "System is Unhealthy",
            data: { database: dbStatus }
        });
    }
};

export default HealthController;
