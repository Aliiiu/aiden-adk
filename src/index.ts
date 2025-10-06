import { getRootAgent } from "./agents/root-agent";
import { config } from "dotenv";

// load env vars
config();

async function main() {
	try {
		console.log("🚀 Starting AIDEN...\n");

		const { runner, agent } = await getRootAgent();

		console.log(`✅ AIDEN initialized successfully`);
		console.log(`📋 Agent: ${agent.name}`);
		console.log(
			`🤖 Sub-agents: ${agent.subAgents.map((a) => a.name).join(", ")}\n`,
		);

		const query = "What is currently happening in the world of crypto?";
		console.log(`💬 Query: ${query}\n`);

		const response = await runner.ask(query);
		console.log(`🤖 AIDEN: ${response}\n`);

		console.log("✨ AIDEN session completed");
	} catch (error) {
		console.error("❌ Error running AIDEN:", error);
		process.exit(1);
	}
}

main();
