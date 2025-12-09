import type { Context } from "telegraf";
import { env } from "../../env";
import { telegramDb } from "../db-service";
import {
	checkIsAdmin,
	getMessageText,
	type TokenLink,
	validateURL,
} from "./utils";

export async function handleLink(ctx: Context): Promise<void> {
	if (!env.DATABASE_URL) {
		await ctx.reply(
			"⚠️ Database not configured. Link tracking is not available.",
		);
		return;
	}

	const isAdmin = await checkIsAdmin(ctx);
	if (!isAdmin) {
		await ctx.reply("❌ Only admins can link tokens in groups.");
		return;
	}

	const messageText = getMessageText(ctx);

	if (!messageText) {
		return;
	}

	const url = messageText.replace("/link", "").trim();

	if (!url) {
		await ctx.reply(
			"Please provide a URL.\n\nExample:\n/link https://www.coingecko.com/en/coins/bitcoin\n/link https://iq.wiki/wiki/ethereum",
		);
		return;
	}

	const tokenInfo = validateURL(url);

	if (!tokenInfo) {
		await ctx.reply(
			"🚫 Invalid URL. Please provide a valid CoinGecko or IQ.Wiki URL.",
		);
		return;
	}

	try {
		const platformChannelId = String(ctx.chat?.id);
		const bot = await telegramDb.getOrCreateBot(platformChannelId);

		if (!bot.teamId) {
			await ctx.reply("❌ Team not configured for this bot.");
			return;
		}

		const links = (await telegramDb.getTeamLinks(bot.teamId)) as TokenLink[];
		const existingLink = links.find((link) => link.id === tokenInfo.id);

		if (existingLink) {
			if (existingLink.url.includes(tokenInfo.url)) {
				await ctx.reply(`🔗 The link for ${tokenInfo.name} already exists.`);
				return;
			}

			if (tokenInfo.id === "iq.wiki") {
				existingLink.url.push(tokenInfo.url);
			} else {
				existingLink.url = [tokenInfo.url];
			}
		} else {
			links.push({
				id: tokenInfo.id,
				url: [tokenInfo.url],
			});
		}

		await telegramDb.updateTeamLinks(bot.teamId, links);
		await ctx.reply(
			`✅ Subscription successfully updated for ${tokenInfo.name}. 🚀`,
		);
	} catch (error) {
		console.error("Error handling link:", error);
		await ctx.reply(
			"🙁 We're sorry, but we couldn't process your subscription at this time. Please try again later.",
		);
	}
}

export async function handleUnlink(ctx: Context): Promise<void> {
	if (!env.DATABASE_URL) {
		await ctx.reply(
			"⚠️ Database not configured. Link tracking is not available.",
		);
		return;
	}

	const isAdmin = await checkIsAdmin(ctx);
	if (!isAdmin) {
		await ctx.reply("❌ Only admins can unlink tokens in groups.");
		return;
	}

	const messageText = getMessageText(ctx);

	if (!messageText) {
		return;
	}

	const parts = messageText.split("/unlink")[1]?.trim().split(" ");

	if (!parts || parts.length === 0 || !parts[0]) {
		await ctx.reply(
			"Link ID not found.\n\nTo unlink, use commands such as:\n/unlink coingecko\n/unlink iq.wiki\n\nOptionally, specify an index:\n/unlink iq.wiki 1",
		);
		return;
	}

	const linkId = parts[0];
	const indices = parts[1]
		? parts[1].split(",").map((index) => Number.parseInt(index.trim(), 10))
		: [];

	try {
		const platformChannelId = String(ctx.chat?.id);
		const bot = await telegramDb.getOrCreateBot(platformChannelId);

		if (!bot.teamId) {
			await ctx.reply("❌ Team not configured for this bot.");
			return;
		}

		const links = (await telegramDb.getTeamLinks(bot.teamId)) as TokenLink[];
		const linkIndex = links.findIndex((link) => link.id === linkId);

		if (linkIndex === -1) {
			await ctx.reply(
				`❌ No token link found for ${linkId}.\n\nUse /list to see all tracked tokens.`,
			);
			return;
		}

		if (indices.length === 0) {
			links.splice(linkIndex, 1);
			await telegramDb.updateTeamLinks(bot.teamId, links);
			await ctx.reply(
				`🚀 Subscription successfully removed for ${linkId} link.`,
			);
		} else {
			const zeroBasedIndices = indices.map((i) => i - 1).sort((a, b) => b - a);
			const successfullyRemoved: number[] = [];
			const failed: number[] = [];

			for (const index of zeroBasedIndices) {
				if (index >= 0 && index < links[linkIndex].url.length) {
					links[linkIndex].url.splice(index, 1);
					successfullyRemoved.push(index + 1);
				} else {
					failed.push(index + 1);
				}
			}

			if (links[linkIndex].url.length === 0) {
				links.splice(linkIndex, 1);
			}

			await telegramDb.updateTeamLinks(bot.teamId, links);

			let message = `🚀 Subscription successfully removed for ${linkId} link`;
			if (successfullyRemoved.length > 0) {
				message += ` number(s) ${successfullyRemoved.join(", ")}.`;
			}
			if (failed.length > 0) {
				message += ` Could not remove link number(s) ${failed.join(", ")} as they don't exist.`;
			}

			await ctx.reply(message);
		}
	} catch (error) {
		console.error("Error handling unlink:", error);
		await ctx.reply("❌ Failed to unlink token. Please try again.");
	}
}

export async function handleList(ctx: Context): Promise<void> {
	if (!env.DATABASE_URL) {
		await ctx.reply(
			"⚠️ Database not configured. Link tracking is not available.",
		);
		return;
	}

	try {
		const platformChannelId = String(ctx.chat?.id);
		const bot = await telegramDb.getOrCreateBot(platformChannelId);

		if (!bot.teamId) {
			await ctx.reply("❌ Team not configured for this bot.");
			return;
		}

		const links = (await telegramDb.getTeamLinks(bot.teamId)) as TokenLink[];

		if (links.length === 0) {
			await ctx.reply(
				"📋 No tokens are currently tracked.\n\nUse /link to add a token.",
			);
			return;
		}

		let message = "<b>📋 Tracked Tokens:</b>\n\n";
		for (const link of links) {
			message += `<b>${link.id}:</b>\n`;
			link.url.forEach((url, index) => {
				message += `  ${index + 1}. ${url}\n`;
			});
			message += "\n";
		}

		await ctx.reply(message, { parse_mode: "HTML" });
	} catch (error) {
		console.error("Error handling list:", error);
		await ctx.reply("❌ Failed to retrieve token list. Please try again.");
	}
}
