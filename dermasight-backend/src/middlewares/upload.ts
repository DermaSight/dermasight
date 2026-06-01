import { Request, Response, NextFunction } from "express";
import multer, { MulterError } from "multer";
import { BadRequestError } from "@/utils/customErrors";

const storage = multer.memoryStorage();

const fileFilter = (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const acceptedMimes = ["image/jpeg", "image/png"];

    if (!acceptedMimes.includes(file.mimetype)) {
        return cb(
            new BadRequestError(
                `Invalid file type. Accepted: JPEG, PNG. Received: ${file.mimetype}`
            )
        );
    }

    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

const uploadFile = (fieldName: string | string[]) => (req: Request, res: Response, next: NextFunction) => {
    const handler = Array.isArray(fieldName)
        ? upload.fields(fieldName.map((name) => ({ name, maxCount: 1 })))
        : upload.single(fieldName);

    handler(req, res, (err) => {
        if (err instanceof MulterError) {
            return next(new BadRequestError(`Upload error: ${err.message}`));
        }
        if (err) {
            return next(new BadRequestError(err.message));
        }
        next();
    });
};

export default uploadFile;
