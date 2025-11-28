import { env } from "../env.js";
import { startPolling } from "./modes/polling.js";
import { startWebhook } from "./modes/webhook.js";

async function main(): Promise<void> {
	const mode = env.TELEGRAM_MODE;

	console.log(`Starting Telegram bot in ${mode.toUpperCase()} mode...`);

	if (mode === "webhook") {
		await startWebhook();
	} else {
		await startPolling();
	}
}

main().catch((error) => {
	console.error("Failed to start Telegram bot:", error);
	process.exit(1);
});
