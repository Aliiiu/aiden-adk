import { Context } from "telegraf";
import { MESSAGE_FOOTER, processQuery } from "../handlers";
import { getMessageText } from "./utils";

export async function handleAi(ctx: Context): Promise<void> {
	// Show typing action
	await ctx.sendChatAction("typing");

	const message = getMessageText(ctx);

	if (!message || typeof message !== "string") {
		console.log("⏭️ Ignoring non-text message");
		return;
	}

	const isPrivate = ctx.chat?.type === "private";
	if (isPrivate) {
		console.log("⛔ /ai command used in private chat — not supported.");
		return;
	}

	const trimmed = message.trim();

	if (!trimmed.startsWith("/ai")) {
		console.log("⏭️ Message does not contain /ai command");
		return;
	}

	const userMessage = trimmed.slice(3).trim();

	if (!userMessage) {
		await ctx.reply(
			`⚠️ Please provide a prompt after <code>/ai</code>.\nExample: <code>/ai Tell me a joke</code>\n\n${MESSAGE_FOOTER}`,
			{ parse_mode: "HTML" },
		);
		return;
	}

	console.log("User AI prompt:", userMessage);

	await processQuery(ctx, userMessage);
}
