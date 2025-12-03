import dedent from "dedent";
import type { Context } from "telegraf";

export interface TokenLink {
	id: string;
	url: string[];
}

export const getHelpMessage = (isGroup: boolean, botUsername?: string) => {
	const prefix = isGroup ? `@${botUsername} ` : "";
	return dedent`<b>AIDEN - AI Assistant for Crypto & Blockchain</b>

	<b>Commands:</b>
	${prefix}/start - Show this help message
	${prefix}/help - Show this help message
	${prefix}/auth [api_key] - Set your API key (optional)
	${prefix}/auth - Check current API key
	${prefix}/price [ticker] - Get crypto price
	${prefix}/summary - Summarize conversation
	${prefix}/link [url] - Track token (CoinGecko/IQ.Wiki)
	${prefix}/unlink [source] - Remove tracked token
	${prefix}/list - Show tracked tokens

	<b>Usage:</b>
	${isGroup ? `Mention me with @${botUsername} or reply to my messages to ask questions.` : "Just send me a message to ask anything about crypto, blockchain, or DeFi!"}`;
};

export function shortenApiKey(key: string): string {
	if (key.length <= 16) return key;
	return `${key.slice(0, 8)}...${key.slice(-8)}`;
}

export function validateURL(
	url: string,
): { id: string; name: string; url: string } | null {
	try {
		const urlObj = new URL(url);

		if (urlObj.hostname.includes("coingecko.com")) {
			const match = urlObj.pathname.match(/\/coins\/([^/]+)/);
			if (match) {
				return {
					id: "coingecko",
					name: match[1],
					url: url,
				};
			}
		}

		if (urlObj.hostname.includes("iq.wiki")) {
			const match = urlObj.pathname.match(/\/wiki\/([^/]+)/);
			if (match) {
				return {
					id: "iq.wiki",
					name: match[1],
					url: url,
				};
			}
		}

		return null;
	} catch {
		return null;
	}
}

export async function checkIsAdmin(ctx: Context): Promise<boolean> {
	const isPrivate = ctx.chat?.type === "private";
	if (isPrivate) return true;

	if (!ctx.chat || !ctx.from) return false;

	try {
		const member = await ctx.telegram.getChatMember(ctx.chat.id, ctx.from.id);
		return member.status === "administrator" || member.status === "creator";
	} catch {
		return false;
	}
}

export const getMessageText = (ctx: Context): string | undefined => {
	return ctx.message && "text" in ctx.message ? ctx.message.text : undefined;
};
