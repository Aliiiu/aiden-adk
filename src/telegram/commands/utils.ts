import dedent from "dedent";
import type { Context } from "telegraf";

export interface TokenLink {
	id: string;
	url: string[];
}

export const getHelpMessage = (isPrivate: boolean, botUsername?: string) => {
	if (isPrivate) {
		return dedent`<b>Welcome to AIDEN!</b> 🤖✨

	To get started, here's a quick guide on how you can interact with me:

	<b>1. Asking Questions & Making Queries</b> ❓
	    - You can ask me questions directly like <code>What is the price of IQ?</code>, <code>Who is the founder of Bitcoin?</code> etc.

	<b>2. Authentication</b> 🔐
	    - Optionally, you can provide an AIDEN API key to get personalized chat from your custom knowledge base.
	    - To authenticate, use the command <code>/auth YOUR_API_KEY</code>
	    - To get your API key, visit https://aiden.id, login > Click on your profile picture > Click on "Api Keys" section > Click on "Create New API Key" button > Copy the API key from there
	    - If you want to know which API key you have, use the command <code>/auth</code> without any arguments.

	<b>3. Setting a Token</b> 🪙
	    - To set a token for tracking price and market data, use the command <code>/link [URL]</code>.
	    - Examples:
	        - <code>/link https://iq.wiki/wiki/bitcoin</code>
	        - <code>/link https://www.coingecko.com/en/coins/bitcoin</code>
	    - This command allows you to monitor specific token data such as current price, market cap, and supply details.
	    - To remove a linked token, use the command <code>/unlink</code>.
	    - Example:
	        - <code>/unlink coingecko</code> — This removes the specific link to the token data.

	<b>4. Checking Token Prices</b> 📈
	    - Once a token is set, use <code>/price</code> to get the latest market data.
	    - You can also check the price of a specific token by using the ticker command, e.g., <code>/price btc</code> to get data on Bitcoin.
	    - This will display information like current price, price change, market cap, and supply metrics.

	<b>5. Getting a Summary of Messages</b> 📝
	    - Use the command <code>/summary</code> to get a summary of messages from the last 24 hours.`;
	}
	return dedent`<b>Welcome to AIDEN!</b> 🤖✨

		To get started, here's a quick guide on how you can interact with me:

		<b>1. Asking Questions & Making Queries</b> ❓
		    - You can ask me questions by tagging me with @${botUsername}
		    - For instance, <code>@${botUsername} what is the price of IQ?</code>, <code>@${botUsername} who is the founder of Bitcoin?</code>

		<b>2. Authentication</b> 🔐 (Admins Only)
		    - Optionally, if you are this group's admin, you can provide an AIDEN API key for personalized chat.
		    - To authenticate, use the command <code>@${botUsername} /auth YOUR_API_KEY</code>
		    - If you want to know which API key you have, use the command <code>@${botUsername} /auth</code> without any arguments.

		<b>3. Setting a Token</b> 🪙 (Admins Only)
		    - Command: <code>@${botUsername} /link [URL]</code>. Sets the token for tracking.
		    - Examples:
		        - <code>@${botUsername} /link https://iq.wiki/wiki/ethereum</code> (IQ.Wiki)
		        - <code>@${botUsername} /link https://www.coingecko.com/en/coins/ethereum</code> (CoinGecko)
		    - To remove the token, use the command <code>/unlink</code>.
		    - Example:
		        - <code>/unlink coingecko</code> — This command removes the specific link to the token data.

		<b>4. Checking Token Prices</b> 📈
		    - Use <code>@${botUsername} /price</code> to view the latest market data of the set token.
		    - Use <code>@${botUsername} /price [token_ticker]</code> e.g <code>@${botUsername} /price btc</code>, to get data on Bitcoin.

		<b>5. Getting a Summary of Messages</b> 📝
		    - Use the command <code>/summary</code> to get a summary of messages from the last 24 hours.`;
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
