import { initializeTelemetry, shutdownTelemetry } from "@iqai/adk";
import { config } from "dotenv";
import { getRootAgent } from "./agents/agent.js";
import { env } from "./env.js";

config();

function initializeLangfuse(): void {
	if (!env.LANGFUSE_PUBLIC_KEY || !env.LANGFUSE_SECRET_KEY) {
		console.log(
			"Set LANGFUSE_PUBLIC_KEY and LANGFUSE_SECRET_KEY to enable telemetry",
		);
		return;
	}

	const langfuseBaseUrl = env.LANGFUSE_BASEURL || "https://cloud.langfuse.com";

	const authString = Buffer.from(
		`${env.LANGFUSE_PUBLIC_KEY}:${env.LANGFUSE_SECRET_KEY}`,
	).toString("base64");

	initializeTelemetry({
		appName: "aiden_adk",
		appVersion: "1.0.0",
		otlpEndpoint: `${langfuseBaseUrl}/api/public/otel/v1/traces`,
		otlpHeaders: {
			Authorization: `Basic ${authString}`,
		},
	});
}

async function main() {
	// Initialize Langfuse telemetry
	initializeLangfuse();

	try {
		console.log("🚀 Starting AIDEN...\n");

		const query = "What is the price of bitcoin?";
		console.log(`💬 Query: ${query}`);

		const { runner } = await getRootAgent();
		const response = await runner.ask(query);

		const workflowAgentResponse = response.find(
			(r) => r.agent === "workflow_agent",
		)?.response;

		console.log(`🤖 AIDEN:`, workflowAgentResponse);
	} catch (error) {
		console.error("❌ Error running AIDEN:", error);
		process.exit(1);
	} finally {
		shutdownTelemetry();
	}
}

main();
