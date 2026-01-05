import { env } from "../env";
import { createTelegramBot } from "./bot-factory";
import { startPolling } from "./modes/polling";

/**
 * Telegram Polling Mode Entry Point
 *
 * This script is ONLY for running Telegram in polling mode via `pnpm telegram`.
 * For webhook mode, use `pnpm start` which integrates webhooks into the Fastify API server.
 */
async function main(): Promise<void> {
	if (env.TELEGRAM_MODE === "webhook") {
		console.error("❌ Error: This script is for POLLING mode only.");
		console.error(
			'   To use webhook mode, set TELEGRAM_MODE=webhook and run "pnpm start"',
		);
		console.error(
			"   Webhooks are integrated into the Fastify API server, not this standalone script.\n",
		);
		process.exit(1);
	}

	console.log("🚀 Starting Telegram bot in POLLING mode...\n");

	const bot = createTelegramBot();
	await startPolling(bot);
}

main().catch((error) => {
	console.error("❌ Failed to start Telegram bot:", error);
	process.exit(1);
});
