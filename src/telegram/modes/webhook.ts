import Fastify from "fastify";
import { Telegraf } from "telegraf";
import type { Update } from "telegraf/types";
import { env } from "../../env.js";
import { getAgentRunner } from "../agent-singleton.js";
import { registerCommands } from "../commands/index.js";
import { registerMessageHandlers } from "../messages.js";

export async function startWebhook(): Promise<void> {
	if (!env.TELEGRAM_BOT_TOKEN) {
		throw new Error("TELEGRAM_BOT_TOKEN is required");
	}

	const bot = new Telegraf(env.TELEGRAM_BOT_TOKEN);
	const app = Fastify({ logger: false });

	registerCommands(bot);
	registerMessageHandlers(bot);

	await getAgentRunner();

	app.get("/health", async () => ({
		status: "ok",
		uptime: process.uptime(),
	}));

	app.post("/telegram/webhook", async (request, reply) => {
		await bot.handleUpdate(request.body as Update);
		return reply.send({ ok: true });
	});

	const port = env.TELEGRAM_WEBHOOK_PORT;
	await app.listen({ port, host: "0.0.0.0" });

	console.log(`🚀 Telegram webhook server listening on port ${port}`);
	console.log(`📡 Webhook endpoint: /telegram/webhook`);
	console.log(
		"\n💡 To complete setup, set your webhook URL using Telegram Bot API:",
	);
	console.log(
		`   curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \\`,
	);
	console.log(`        -d "url=https://your-domain.com/telegram/webhook"\n`);
}
