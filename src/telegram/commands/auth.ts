import type { Context } from "telegraf";
import { telegramDb } from "../db-service";
import { getMessageText, shortenApiKey } from "./utils";

export async function handleAuth(ctx: Context): Promise<void> {
	const messageText = getMessageText(ctx)!;
	const apiKey = messageText.split("/auth")[1].trim();
	const platformChannelId = String(ctx.chat?.id);

	console.log("[auth] Command received");
	console.log("[auth] platformChannelId:", platformChannelId);
	console.log("[auth] apiKey provided:", apiKey ? "YES" : "NO");

	try {
		const bot = await telegramDb.getOrCreateBot(platformChannelId);
		console.log("[auth] Bot retrieved:", {
			botId: bot.id,
			platformChannelId: bot.platformChannelId,
			currentTeamId: bot.teamId,
			currentApiKey: bot.ownerApiKey ? "SET" : "NOT SET",
		});

		if (!apiKey) {
			const currentKey = bot.ownerApiKey;
			const message = currentKey
				? `ℹ️ Currently set API key: ${shortenApiKey(currentKey)}\n\nYou can change it by sending: /auth [new key]`
				: "❌ No API key set.\n\nYou can set it by sending: /auth [new key]";

			await ctx.reply(message);
			return;
		}

		console.log("[auth] Updating bot with API key...");
		const updatedBot = await telegramDb.updateBotApiKeyAndTeam(bot.id, apiKey);

		console.log("[auth] Bot updated:", {
			botId: updatedBot.id,
			teamId: updatedBot.teamId,
			ownerApiKey: updatedBot.ownerApiKey ? "SET" : "NOT SET",
		});

		if (!updatedBot.teamId) {
			console.log("[auth] ❌ Team not found for API key");
			await ctx.reply("❌ Invalid API key. Please check and try again.");
			return;
		}

		console.log("[auth] ✅ Authentication successful");
		await ctx.reply(
			`✅ API key set successfully: ${shortenApiKey(apiKey)}\n\nYou can now use the bot with your custom settings.`,
		);
	} catch (error) {
		console.error("Error handling auth:", error);
		await ctx.reply("❌ Failed to set API key. Please try again.");
	}
}
