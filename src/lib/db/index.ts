import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { env } from "../../env";

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

const NODE_ENV_PRODUCTION = "production";
const NODE_ENV_DEVELOPMENT = "development";

if (!env.DATABASE_URL) {
	throw new Error("DATABASE_URL is required to initialize Prisma.");
}

const adapter = new PrismaPg(
	new Pool({
		connectionString: env.DATABASE_URL,
		ssl:
			process.env.NODE_ENV === NODE_ENV_PRODUCTION
				? { rejectUnauthorized: false }
				: undefined,
	}),
);

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		adapter,
		log:
			process.env.NODE_ENV === NODE_ENV_DEVELOPMENT
				? ["error", "warn"]
				: ["error"],
	});

if (process.env.NODE_ENV !== NODE_ENV_PRODUCTION) {
	globalForPrisma.prisma = prisma;
}
