import nodemailer from "nodemailer";
import { requireEnv } from "@/utils/env";

let transporter: nodemailer.Transporter;

function getTransporter() {
    if (!transporter) {
        const host = requireEnv("SMTP_HOST");
        const port = parseInt(requireEnv("SMTP_PORT"), 10);
        const user = requireEnv("SMTP_USER");
        const pass = requireEnv("SMTP_PASS");

        transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass }
        });
    }
    return transporter;
}

export async function sendContactEmail(subject: string, content: string) {
    const fromEmail = process.env.CONTACT_FROM_EMAIL || requireEnv("SMTP_USER");
    const toRaw = requireEnv("CONTACT_EMAIL");
    const recipients = toRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    if (recipients.length === 0) {
        throw new Error("CONTACT_EMAIL is empty after parsing");
    }

    const transporter = getTransporter();

    await transporter.sendMail({
        from: { name: "Support Team - Dermasight", address: fromEmail },
        to: recipients.join(", "),
        subject: `[Contact-Us Form from Dermasight App] ${subject}`,
        text: content
    });
}
