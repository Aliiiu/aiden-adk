import type { Context, Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { processQuery } from "./handlers";

export function registerMessageHandlers(bot: Telegraf<Context>): void {
	console.log("🔧 Installing message handler...");
	bot.on(message("text"), handleTextMessage);
}

async function handleTextMessage(ctx: Context): Promise<void> {
	if (!("message" in ctx) || !ctx.message || !("text" in ctx.message)) {
		console.log("⏭️ Ignoring non-text message");
		return;
	}

	const text = ctx.message.text;
	console.log("📨 Received message:", text);

	const isPrivate = ctx.chat?.type === "private";
	const botUsername = ctx.botInfo.username;
	const isMentioned = text.includes(`@${botUsername}`);

	if (!isPrivate && !isMentioned) {
		console.log("⏭️ Ignoring message (not private, mentioned, or reply)");
		return;
	}

	const cleanText = text.replace(`@${botUsername}`, "").trim();

	if (cleanText) {
		console.log(`🔄 Processing query: "${cleanText}"`);
		await processQuery(ctx, cleanText);
	}
}
