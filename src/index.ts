import { getRootAgent } from "./agents/root-agent";
import { getLanguageDetector } from "./agents/language-detector";
import { config } from "dotenv";

// load env vars
config();

async function main() {
	try {
		console.log("🚀 Starting AIDEN...\n");

		const query = "What is gas fee?";
		console.log(`💬 Query: ${query}`);

		const languageDetector = await getLanguageDetector();

		const languageResponse = await languageDetector.ask(query);

		const detectedLanguage = languageResponse.language || "en";

		console.log(`🌍 Detected language: ${detectedLanguage}\n`);

		const { runner, agent } = await getRootAgent(detectedLanguage);

		console.log(`✅ AIDEN initialized successfully`);
		console.log(`📋 Agent: ${agent.name}`);
		console.log(
			`🤖 Sub-agents: ${agent.subAgents.map((a) => a.name).join(", ")}\n`,
		);
		console.log(`🌍 Agent configured for language: ${detectedLanguage}\n`);

		const response = await runner.ask(query);
		console.log(`🤖 AIDEN: ${response}\n`);

		console.log("✨ AIDEN session completed");
	} catch (error) {
		console.error("❌ Error running AIDEN:", error);
		process.exit(1);
	}
}

main();
