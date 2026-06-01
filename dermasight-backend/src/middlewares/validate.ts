import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "@/utils/customErrors";

const validate = (schema: ZodType, source: "params" | "query" | "body") => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[source]);
        if (!result.success) {
            const issues = result.error.issues.map((i) => ({
                message: `${i.path.join(".")}: ${i.message}`
            }));
            throw new BadRequestError("Validation failed", issues);
        }
        try {
            req[source] = result.data;
        } catch {
            // Express 5 makes req.query readonly via a getter
            Object.defineProperty(req, source, {
                value: result.data,
                writable: true,
                configurable: true
            });
        }
        next();
    };
};

export default validate;
