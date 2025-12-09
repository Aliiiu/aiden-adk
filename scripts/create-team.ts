import { randomBytes } from "node:crypto";
import { prisma } from "../src/lib/db";

async function createTeam() {
	const apiKey = `iq_${randomBytes(16).toString("hex")}`;

	const team = await prisma.team.create({
		data: {
			name: "Default Team",
			apiKeys: [apiKey],
			customInstructions: null,
			links: [],
			settings: [],
			logs: undefined,
		},
	});

	console.log("✅ Team created successfully!");
	console.log("Team ID:", team.id);
	console.log("API Key:", apiKey);
	console.log("\nUse this command in Telegram:");
	console.log(`/auth ${apiKey}`);

	await prisma.$disconnect();
}

createTeam().catch((error) => {
	console.error("Error creating team:", error);
	process.exit(1);
});
