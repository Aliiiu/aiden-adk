import type { Context } from "telegraf";
import { getHelpMessage } from "./utils";

const buildHelpMessage = (ctx: Context): string => {
	const isPrivate = ctx.chat?.type === "private";
	const botUsername = ctx.botInfo.username;
	return getHelpMessage(isPrivate, botUsername);
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
