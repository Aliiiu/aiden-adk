import { config } from "dotenv";
import { getRootAgent } from "./agents/agent";

config();

async function main() {
	try {
		console.log("🚀 Starting AIDEN...\n");

		const query = "What is gas fee?";
		console.log(`💬 Query: ${query}`);

		const { runner } = await getRootAgent();
		const response = await runner.ask(query);

		console.log(`🤖 AIDEN: ${response}\n`);
	} catch (error) {
		console.error("❌ Error running AIDEN:", error);
		process.exit(1);
	}
}

main();
