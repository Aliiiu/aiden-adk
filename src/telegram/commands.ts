import type { Context, Telegraf } from "telegraf";
import { processQuery } from "./handlers.js";

const HELP_MESSAGE =
	"Available commands:\n/price [ticker] - Get crypto price\n/summary - Summarize text\n/help - Show this message";

export function registerCommands(bot: Telegraf<Context>): void {
	bot.command("start", handleStart);
	bot.command("help", handleHelp);
	bot.command("price", handlePrice);
	bot.command("summary", handleSummary);
}

function handleStart(ctx: Context): void {
	ctx.reply(`Hello! I am Aiden, your AI assistant.\n\n${HELP_MESSAGE}`);
}

function handleHelp(ctx: Context): void {
	ctx.reply(HELP_MESSAGE);
}

async function handlePrice(ctx: Context): Promise<void> {
	const messageText =
		ctx.message && "text" in ctx.message ? ctx.message.text : undefined;

	if (!messageText) {
		await ctx.reply("Please provide a ticker. Example: /price BTC");
		return;
	}

	const [, ticker] = messageText.trim().split(/\s+/);

	if (!ticker) {
		await ctx.reply("Please provide a ticker. Example: /price BTC");
		return;
	}

	await processQuery(ctx, `What is the price of ${ticker}?`);
}

async function handleSummary(ctx: Context): Promise<void> {
	await processQuery(ctx, "Please provide a summary of the current context.");
}
