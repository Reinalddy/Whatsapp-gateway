// prisma/client.ts
import { PrismaClient } from "@/app/generated/prisma";

export const prisma = new PrismaClient();

// if (process.env.NODE_ENV !== "production") global.prisma = prisma;
