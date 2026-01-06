import { initializeTelemetry, shutdownTelemetry } from "@iqai/adk";
import { config } from "dotenv";
import Fastify from "fastify";
import type { Telegraf } from "telegraf";
import { env } from "./env";
import { initializeSharedAgentBuilder } from "./lib/agent-builder-cache";
import { authMiddleware } from "./server/middleware/auth";
import { queryHandler } from "./server/routes/query";
import { createTelegramWebhookHandler } from "./server/routes/telegram-webhook";
import { createTelegramBot } from "./telegram/bot-factory";

interface ServiceConfig {
	apiEnabled: boolean;
	webhookEnabled: boolean;
	telegramBot?: Telegraf;
}

config();

// ============================================================================
// Telemetry Setup
// ============================================================================

function initializeLangfuse(): void {
	if (!env.LANGFUSE_PUBLIC_KEY || !env.LANGFUSE_SECRET_KEY) {
		console.log(
			"⚠️  Telemetry disabled: Set LANGFUSE_PUBLIC_KEY and LANGFUSE_SECRET_KEY to enable",
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
		otlpHeaders: { Authorization: `Basic ${authString}` },
	});

	console.log("✅ Telemetry enabled");
}

// ============================================================================
// Service Configuration
// ============================================================================

function determineServices(): ServiceConfig {
	const telegramBot = env.TELEGRAM_BOT_TOKEN ? createTelegramBot() : undefined;

	const webhookEnabled =
		telegramBot !== undefined && env.TELEGRAM_MODE === "webhook";
	const apiEnabled = env.API_ENABLED || webhookEnabled;

	return { apiEnabled, webhookEnabled, telegramBot };
}

function validateConfiguration(config: ServiceConfig): void {
	const { apiEnabled, webhookEnabled, telegramBot } = config;

	if (!apiEnabled && !webhookEnabled) {
		console.error("❌ No services enabled");
		console.error(
			"Set API_ENABLED=true or configure TELEGRAM_BOT_TOKEN with TELEGRAM_MODE=webhook",
		);
		process.exit(1);
	}

	if (telegramBot && env.TELEGRAM_MODE === "polling") {
		console.log("⚠️  Telegram polling mode detected");
		console.log("   Use 'pnpm telegram' to start Telegram in polling mode");
		console.log("   This script only starts API server and webhook mode\n");
	}
}

function logStartupPlan(config: ServiceConfig): void {
	console.log("📋 Starting services:");
	if (config.apiEnabled) {
		console.log("   ✓ API Server");
	}
	if (config.webhookEnabled) {
		console.log("   ✓ Telegram Webhook");
	}
	console.log("");
}

// ============================================================================
// Service Startup
// ============================================================================

async function startServices(config: ServiceConfig): Promise<void> {
	const { apiEnabled, webhookEnabled, telegramBot } = config;

	if (!apiEnabled) {
		return;
	}

	// Initialize the shared agent builder once at startup
	await initializeSharedAgentBuilder();

	// Create Fastify app instance
	const app = Fastify({
		logger: env.LOG_LEVEL
			? {
					level: env.LOG_LEVEL,
					transport: {
						target: "pino-pretty",
						options: {
							colorize: true,
							translateTime: "HH:MM:ss",
							ignore: "pid,hostname",
						},
					},
				}
			: false,
	});

	app.get("/health", async () => ({
		status: "ok",
		uptime: process.uptime(),
		timestamp: new Date().toISOString(),
	}));

	// Register Telegram webhook if bot instance is provided
	if (webhookEnabled && telegramBot) {
		app.post("/telegram/webhook", createTelegramWebhookHandler(telegramBot));
		console.log("📱 Telegram webhook registered at /telegram/webhook");
	}

	app.post("/api/query", {
		preHandler: authMiddleware,
		handler: queryHandler,
	});

	const port = env.API_PORT;
	await app.listen({ port, host: "0.0.0.0" });

	console.log(`🚀 API server listening on port ${port}`);
	console.log("");

	if (webhookEnabled && telegramBot) {
		console.log("📱 Telegram webhook endpoint: POST /telegram/webhook");
		console.log(
			"\n💡 To complete Telegram setup, set your webhook URL using Telegram Bot API:",
		);
		console.log(
			`   curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \\`,
		);
		console.log(`        -d "url=https://your-domain.com/telegram/webhook"\n`);
	}
}

// ============================================================================
// Main Entry Point
// ============================================================================

async function main(): Promise<void> {
	console.log("🚀 Starting AIDEN...\n");

	initializeLangfuse();
	console.log("");

	const config = determineServices();
	validateConfiguration(config);
	logStartupPlan(config);

	try {
		await startServices(config);
	} catch (error) {
		console.error("❌ Failed to start services:", error);
		process.exit(1);
	} finally {
		shutdownTelemetry();
	}
}

main();
