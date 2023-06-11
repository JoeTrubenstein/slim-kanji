import { PrismaClient } from "@prisma/client";

// prevent new client connection on every hot reload 
const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV === "development") {
    global.prisma = prisma
}

export {prisma}