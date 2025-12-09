import type { Context, Telegraf } from "telegraf";
import { handleAuth } from "./auth";
import { handleHelp, handleStart } from "./help";
import { handleLink, handleList, handleUnlink } from "./links";
import { handlePrice } from "./price";
import { handleSummary } from "./summary";

export function registerCommands(bot: Telegraf<Context>): void {
	bot.command("start", handleStart);
	bot.command("help", handleHelp);
	bot.command("auth", handleAuth);
	bot.command("link", handleLink);
	bot.command("unlink", handleUnlink);
	bot.command("list", handleList);
	bot.command("price", handlePrice);
	bot.command("summary", handleSummary);
}
