import { Server } from "http";
import { AddressInfo } from "net";
import app from "@/app";

let server: Server | null = null;

export async function startTestServer(): Promise<string> {
    return new Promise((resolve, reject) => {
        server = app.listen(0, "127.0.0.1", () => {
            const { port } = server!.address() as AddressInfo;
            resolve(`http://127.0.0.1:${port}/api`);
        });
        server!.on("error", reject);
    });
}

export async function stopTestServer(): Promise<void> {
    return new Promise((resolve) => {
        if (server) {
            server.close(() => resolve());
        } else {
            resolve();
        }
    });
}
