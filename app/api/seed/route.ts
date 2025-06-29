import { NextResponse } from "next/server";
import { prisma } from "@helpers/prismaCall";

export async function GET() {
    try {
        // Upsert permission agar pasti tersedia
        const readMessagePermission = await prisma.permission.upsert({
            where: { name: "read_message" },
            update: {},
            create: {
                name: "read_message",
                description: "Can view message",
            },
        });

        const manageUsersPermission = await prisma.permission.upsert({
            where: { name: "manage_users" },
            update: {},
            create: {
                name: "manage_users",
                description: "Full user access",
            },
        });

        const readPostsPermission = await prisma.permission.upsert({
            where: { name: "read_posts" },
            update: {},
            create: {
                name: "read_posts",
                description: "Can read posts",
            },
        });

        // Buat role 'user' dan kaitkan dengan read_message
        const userRole = await prisma.role.upsert({
            where: { name: "user" },
            update: {},
            create: {
                name: "user",
                permissions: {
                    create: [
                        { permission: { connect: { name: "read_message" } } },
                    ],
                },
            },
        });

        // Buat role 'admin' dan kaitkan dengan read_posts
        const adminRole = await prisma.role.upsert({
            where: { name: "admin" },
            update: {},
            create: {
                name: "admin",
                permissions: {
                    create: [
                        { permission: { connect: { name: "read_posts" } } },
                    ],
                },
            },
        });

        return NextResponse.json({ message: "✅ Seeding selesai!" });
    } catch (e: any) {
        console.error("❌ Gagal seed:", e);
        return NextResponse.json(
            { error: "Seeding gagal", detail: e.message },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
