import type { Context, Middleware, Telegraf } from "telegraf";
import { handleAi } from "./ai";
import { handleAuth } from "./auth";
import { handleHelp, handleStart } from "./help";
import { handleLink, handleList, handleUnlink } from "./links";
import { handlePrice } from "./price";
import { handleSummary } from "./summary";
import { checkIsAdmin } from "./utils";

/**
 * Middleware to validate that commands are sent as text messages
 * This prevents crashes when commands are sent with non-text content (photos, stickers, etc.)
 */
function validateTextCommand(): Middleware<Context> {
	return async (ctx, next) => {
		if (!ctx.message) {
			return next();
		}

		if ("text" in ctx.message && ctx.message.text) {
			return next();
		}

		await ctx.reply("⚠️ Please send commands as text messages");
	};
}

/**
 * Middleware to require admin privileges for commands
 * In private chats, all users are considered admins
 * In group chats, only group admins can execute the command
 */
function requireAdmin(): Middleware<Context> {
	return async (ctx, next) => {
		const isAdmin = await checkIsAdmin(ctx);
		if (!isAdmin) {
			await ctx.reply("❌ Only admins can use this command in groups.");
			return;
		}
		return next();
	};
}

export function registerCommands(bot: Telegraf<Context>): void {
	// Apply validation middleware to all commands
	const textValidation = validateTextCommand();
	const adminValidation = requireAdmin();

	// Public commands (no admin required)
	bot.command("start", textValidation, handleStart);
	bot.command("help", textValidation, handleHelp);
	bot.command("list", textValidation, handleList);
	bot.command("price", textValidation, handlePrice);
	bot.command("summary", textValidation, handleSummary);
	bot.command("ai", textValidation, handleAi);

	// Admin-only commands
	bot.command("auth", textValidation, adminValidation, handleAuth);
	bot.command("link", textValidation, adminValidation, handleLink);
	bot.command("unlink", textValidation, adminValidation, handleUnlink);
}
