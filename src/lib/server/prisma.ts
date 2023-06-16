import { PrismaClient } from "@prisma/client";

// prevent new client connection on every hot reload 
const prisma = new PrismaClient() || global.prisma 

if (process.env.NODE_ENV === "development") {
    global.prisma = prisma
}

export {prisma}