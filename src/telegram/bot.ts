import { env } from "../env";
import { startPolling } from "./modes/polling";
import { setupTelegramWebhook, startWebhook } from "./modes/webhook";

async function main(): Promise<void> {
	const mode = env.TELEGRAM_MODE;

	const bot = await setupTelegramWebhook();

	console.log(`Starting Telegram bot in ${mode.toUpperCase()} mode...`);

	if (mode === "webhook") {
		await startWebhook(bot);
	} else {
		await startPolling(bot);
	}
}

main().catch((error) => {
	console.error("Failed to start Telegram bot:", error);
	process.exit(1);
});
