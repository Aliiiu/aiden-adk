import { initializeTelemetry } from "@iqai/adk";
import { config } from "dotenv";
import { Telegraf } from "telegraf";
import { startApiServer } from "./api/server";
import { env } from "./env";
import { registerCommands } from "./telegram/commands/index";
import { registerMessageHandlers } from "./telegram/messages";
import { startPolling } from "./telegram/modes/polling";
import { getAgentRunner } from "./telegram/telegram-agent-runner";

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

async function setupTelegramBot(): Promise<Telegraf | null> {
	if (!env.TELEGRAM_BOT_TOKEN) {
		return null;
	}

	const bot = new Telegraf(env.TELEGRAM_BOT_TOKEN);
	registerCommands(bot);
	registerMessageHandlers(bot);
	await getAgentRunner();

	return bot;
}

async function main() {
	initializeLangfuse();

	console.log("🚀 Starting AIDEN...\n");

	const telegramBot = await setupTelegramBot();

	if (!telegramBot && !env.API_ENABLED) {
		console.error(
			"❌ No services enabled. Set TELEGRAM_BOT_TOKEN or API_ENABLED=true",
		);
		process.exit(1);
	}

	const promises: Promise<void>[] = [];

	// If Telegram is in polling mode, start it separately
	if (telegramBot && env.TELEGRAM_MODE === "polling") {
		console.log("📱 Starting Telegram bot in POLLING mode...");
		promises.push(startPolling(telegramBot));
	}

	// Start API server if enabled OR if Telegram is in webhook mode
	if (env.API_ENABLED || (telegramBot && env.TELEGRAM_MODE === "webhook")) {
		// Only pass telegramBot if in webhook mode
		const botForWebhook =
			telegramBot && env.TELEGRAM_MODE === "webhook" ? telegramBot : undefined;

		if (botForWebhook) {
			console.log("📱 Starting Telegram bot in WEBHOOK mode...");
		}

		if (env.API_ENABLED) {
			console.log("🌐 Starting API server...");
		}

		promises.push(
			startApiServer({
				telegramBot: botForWebhook,
			}),
		);
	}

	try {
		await Promise.all(promises);
	} catch (error) {
		console.error("❌ Error starting services:", error);
		process.exit(1);
	}
}

main();
