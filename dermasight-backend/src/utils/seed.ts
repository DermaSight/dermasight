import "dotenv/config";
import prisma from "@/lib/prisma";
import { requireEnv } from "@/utils/env";

(async () => {
    try {
        const email = requireEnv("SUPER_ADMIN_EMAIL");
        const password = requireEnv("SUPER_ADMIN_PASSWORD");
        const name = process.env.SUPER_ADMIN_NAME || "Super Admin";

        const hashed = await Bun.password.hash(password, {
            algorithm: "argon2id"
        });

        const user = await prisma.user.upsert({
            where: { email },
            update: { role: "ADMIN" },
            create: { email, password: hashed, name, role: "ADMIN" }
        });

        console.log(`Super admin '${email}' ready (id: ${user.id})`);
        process.exit(0);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error(`Seed failed: ${message}`);
        process.exit(1);
    }
})();
