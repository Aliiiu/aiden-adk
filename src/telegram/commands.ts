import type { Context } from "telegraf";
import { processQuery } from "./handlers.js";

export function registerCommands(bot: any): void {
	bot.command("start", handleStart);
	bot.command("help", handleHelp);
	bot.command("price", handlePrice);
	bot.command("summary", handleSummary);
}

function handleStart(ctx: Context): void {
	ctx.reply(
		"Hello! I am Aiden, your AI assistant.\n\nCommands:\n/price [ticker] - Get crypto price\n/summary - Summarize text\n/help - Show this message",
	);
}

function handleHelp(ctx: Context): void {
	ctx.reply(
		"Available commands:\n/price [ticker] - Get crypto price\n/summary - Summarize text\n/help - Show this message",
	);
}

async function handlePrice(ctx: Context): Promise<void> {
	const text = (ctx.message as any).text;
	const parts = text.split(" ");

	if (parts.length < 2) {
		await ctx.reply("Please provide a ticker. Example: /price BTC");
		return;
	}

	const ticker = parts[1];
	await processQuery(ctx, `What is the price of ${ticker}?`);
}

async function handleSummary(ctx: Context): Promise<void> {
	const replyTo = (ctx.message as any).reply_to_message;
	const replyText = replyTo?.text || null;

	if (replyText) {
		await processQuery(ctx, "Please summarize the context.", replyText);
	} else {
		await processQuery(ctx, "Please provide a summary of the current context.");
	}
}
