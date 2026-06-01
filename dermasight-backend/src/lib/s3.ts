import {
    S3Client,
    PutObjectCommand,
    PutObjectCommandInput,
    GetObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl as generatePresignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { formatErr } from "@/utils/format";

const s3Client = new S3Client({
    region: process.env.R2_REGION || "auto",
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
    },
    endpoint: process.env.R2_STORAGE_URL
});

export const uploadFileToBucket = async (
    file: Express.Multer.File,
    prefix?: string
): Promise<{ key: string; url: string }> => {
    if (!file) {
        throw new Error("No file provided");
    }

    const keyPrefix = prefix ?? "predictions";
    const fileKey = `${keyPrefix}/${Date.now()}-${randomUUID()}-${file.originalname}`;
    const bucketName = process.env.R2_BUCKET_NAME || "dermasight";

    const params: PutObjectCommandInput = {
        Bucket: bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype
    };

    try {
        await s3Client.send(new PutObjectCommand(params));

        const storageUrl = process.env.R2_STORAGE_URL;
        return { key: fileKey, url: `${storageUrl}/${fileKey}` };
    } catch (error) {
        throw new Error(`S3 upload failed: ${formatErr(error, "Unknown error")}`);
    }
};

export const getPresignedUrl = async (
    key: string,
    expiresIn: number = 604800
): Promise<string> => {
    const bucketName = process.env.R2_BUCKET_NAME || "dermasight";
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key
    });

    try {
        return await generatePresignedUrl(s3Client, command, { expiresIn });
    } catch (error) {
        throw new Error(`Failed to generate presigned URL: ${formatErr(error, "Unknown error")}`);
    }
};

export const signField = async (
    obj: Record<string, string | null | undefined>,
    field: string
): Promise<void> => {
    const value = obj[field];
    if (!value) return;
    try {
        obj[field] = await getPresignedUrl(value);
    } catch {}
};

export default s3Client;
