import type { Context } from "telegraf";
import { getHelpMessage } from "./utils.js";

const buildHelpMessage = (ctx: Context): string => {
	const isGroup = ctx.chat?.type === "group" || ctx.chat?.type === "supergroup";
	const botUsername = ctx.botInfo.username;
	return getHelpMessage(isGroup, botUsername);
};

async function replyWithHelp(ctx: Context): Promise<void> {
	const helpMessage = buildHelpMessage(ctx);
	await ctx.reply(helpMessage, { parse_mode: "HTML" });
}

export async function handleStart(ctx: Context): Promise<void> {
	await replyWithHelp(ctx);
}

export async function handleHelp(ctx: Context): Promise<void> {
	await replyWithHelp(ctx);
}
