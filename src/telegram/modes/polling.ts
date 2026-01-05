import type { Telegraf } from "telegraf";
import { initializeSharedAgentBuilder } from "../../lib/agent-builder-cache";

export async function startPolling(bot: Telegraf): Promise<void> {
	// Initialize the shared agent builder once at startup
	await initializeSharedAgentBuilder();

	console.log("🚀 Launching bot...");
	await bot.launch();
	console.log("🚀 Telegram bot started in POLLING mode");
	console.log("✅ Bot is now listening for messages");

	process.once("SIGINT", () => bot.stop("SIGINT"));
	process.once("SIGTERM", () => bot.stop("SIGTERM"));
}
