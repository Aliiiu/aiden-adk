import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { env } from "../env";

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

if (!env.DATABASE_URL) {
	throw new Error("DATABASE_URL is required to initialize Prisma.");
}

const adapter = new PrismaPg(new Pool({ connectionString: env.DATABASE_URL }));

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		adapter,
		log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
	});

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}
