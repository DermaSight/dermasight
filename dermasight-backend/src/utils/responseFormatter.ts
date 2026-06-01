import { Response } from "express";

interface ResponseData {
    res: Response;
    code: number;
    message: string;
    data?: object;
}

const fResponse = ({ res, code, message, data }: ResponseData): Response => {
    return res.status(code).json({
        status: code < 400 ? "success" : "failed",
        message,
        data
    });
};

export default fResponse;
