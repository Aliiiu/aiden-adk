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

	// In private chats, accept all messages
	if (isPrivate) {
		console.log(`🔄 Processing private chat query: "${text}"`);
		await processQuery(ctx, text);
		return;
	}

	// In group/supergroup chats, check validation criteria
	const botUsername = ctx.botInfo.username;
	const isMentioned = text.includes(`@${botUsername}`);
	const isReplyToBot =
		ctx.message.reply_to_message?.from?.id === ctx.botInfo.id;
	const allowedCommands = ["/ai", "/price", "/summary"];
	const startsWithAllowedCommand = allowedCommands.some((cmd) =>
		text.startsWith(cmd),
	);

	if (isMentioned || startsWithAllowedCommand || isReplyToBot) {
		const cleanText = text.replace(`@${botUsername}`, "").trim();

		if (cleanText) {
			console.log(
				`🔄 Processing group chat query: "${cleanText}" (mentioned: ${isMentioned}, command: ${startsWithAllowedCommand}, reply: ${isReplyToBot})`,
			);
			await processQuery(ctx, cleanText);
		}
	} else {
		console.log(
			"⏭️ Ignoring group message (not mentioned, not allowed command, not reply to bot)",
		);
	}
}
