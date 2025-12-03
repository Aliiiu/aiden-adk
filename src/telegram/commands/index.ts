import type { Context, Telegraf } from "telegraf";
import { handleAuth } from "./auth.js";
import { handleHelp, handleStart } from "./help.js";
import { handleLink, handleList, handleUnlink } from "./links.js";
import { handlePrice } from "./price.js";
import { handleSummary } from "./summary.js";

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
