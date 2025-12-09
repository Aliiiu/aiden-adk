import Fastify from "fastify";
import type { Telegraf } from "telegraf";
import { env } from "../env";
import { authMiddleware } from "./middleware/auth";
import { queryHandler } from "./routes/query";
import { createTelegramWebhookHandler } from "./routes/telegram-webhook";

interface ApiServerOptions {
	telegramBot?: Telegraf;
}

export async function startApiServer(
	options: ApiServerOptions = {},
): Promise<void> {
	const app = Fastify({
		logger: env.LOG_LEVEL ? { level: env.LOG_LEVEL } : false,
	});

	app.get("/health", async () => ({
		status: "ok",
		uptime: process.uptime(),
		timestamp: new Date().toISOString(),
	}));

	// Register Telegram webhook if bot instance is provided
	if (options.telegramBot) {
		app.post(
			"/telegram/webhook",
			createTelegramWebhookHandler(options.telegramBot),
		);
		console.log("📱 Telegram webhook registered at /telegram/webhook");
	}

	app.post("/api/query", {
		preHandler: authMiddleware,
		handler: queryHandler,
	});

	const port = env.API_PORT;
	await app.listen({ port, host: "0.0.0.0" });

	console.log(`🚀 API server listening on port ${port}`);
	console.log("📡 Query endpoint: POST /api/query");
	console.log("💚 Health check: GET /health");

	if (options.telegramBot) {
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
