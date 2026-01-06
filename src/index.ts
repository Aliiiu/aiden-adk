import { initializeTelemetry, shutdownTelemetry } from "@iqai/adk";
import { config } from "dotenv";
import type { Telegraf } from "telegraf";
import { env } from "./env";
import { startApiServer } from "./server";
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

	const botForWebhook = webhookEnabled ? telegramBot : undefined;

	await startApiServer({ telegramBot: botForWebhook });
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
