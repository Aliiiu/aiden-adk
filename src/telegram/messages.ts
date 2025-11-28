import type { Context } from "telegraf";
import { message } from "telegraf/filters";
import { processQuery } from "./handlers.js";

export function registerMessageHandlers(bot: any): void {
	console.log("🔧 Installing message handler...");
	bot.on(message("text"), handleTextMessage);
}

async function handleTextMessage(ctx: Context): Promise<void> {
	console.log("📨 Received message:", (ctx.message as any).text);

	const text = (ctx.message as any).text;
	const isPrivate = ctx.chat?.type === "private";
	const botUsername = ctx.botInfo.username;
	const isMentioned = text.includes(`@${botUsername}`);
	const isReplyToBot =
		(ctx.message as any).reply_to_message?.from?.username === botUsername;

	console.log(
		`📊 Chat type: ${ctx.chat?.type}, Private: ${isPrivate}, Mentioned: ${isMentioned}, Reply: ${isReplyToBot}`,
	);

	if (!isPrivate && !isMentioned && !isReplyToBot) {
		console.log("⏭️ Ignoring message (not private, mentioned, or reply)");
		return;
	}

	const cleanText = text.replace(`@${botUsername}`, "").trim();
	const replyContext = (ctx.message as any).reply_to_message?.text || null;

	if (cleanText) {
		console.log(`🔄 Processing query: "${cleanText}"`);
		await processQuery(ctx, cleanText, replyContext);
	}
}
