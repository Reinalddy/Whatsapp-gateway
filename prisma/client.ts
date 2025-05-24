// prisma/client.ts
import { PrismaClient } from "@/app/generated/prisma";

declare global {
    let prisma: PrismaClient | undefined;
}

export const prisma = new PrismaClient();

// if (process.env.NODE_ENV !== "production") global.prisma = prisma;
