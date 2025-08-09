// prisma/client.ts
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient();

// if (process.env.NODE_ENV !== "production") global.prisma = prisma;
