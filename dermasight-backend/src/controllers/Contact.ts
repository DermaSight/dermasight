import { Request, Response } from "express";
import fResponse from "@/utils/responseFormatter";
import { sendContactEmail } from "@/utils/mailer";
import { InternalServerError } from "@/utils/customErrors";

const ContactController = {
    send: async (req: Request, res: Response) => {
        const { subject, content } = req.body;

        try {
            await sendContactEmail(subject, content);
        } catch (error) {
            throw new InternalServerError("Failed to send message");
        }

        return fResponse({
            res,
            code: 200,
            message: "Message sent successfully",
            data: {}
        });
    }
};

export default ContactController;
