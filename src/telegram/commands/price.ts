import dedent from "dedent";
import type { Context } from "telegraf";
import { z } from "zod";
import { env } from "../../env";
import { telegramDb } from "../db-service";
import { mapLanguageToCode } from "../utils/language-mapper";
import { getMessageText } from "./utils";

interface TokenLink {
	id: string;
	url: string[];
}

const coingeckoResponseSchema = z.array(
	z.object({
		name: z.string(),
		symbol: z.string(),
		market_cap_rank: z.number().nullish(),
		current_price: z.number().nullish().default(0),
		market_cap: z.number().nullish().default(0),
		total_volume: z.number().nullish().default(0),
		price_change_percentage_1h_in_currency: z.number().nullish(),
		price_change_percentage_24h_in_currency: z.number().nullish(),
		price_change_percentage_7d_in_currency: z.number().nullish(),
	}),
);

type CoinGeckoData = z.infer<typeof coingeckoResponseSchema>[0];

const currencyFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	minimumFractionDigits: 2,
	maximumFractionDigits: 8,
});

const compactFormatter = new Intl.NumberFormat("en-US", {
	notation: "compact",
	compactDisplay: "short",
});

const TICKER_TO_ID_MAP: Record<string, string> = {
	iq: "everipedia",
	frax: "frax-share",
};

export async function handlePrice(ctx: Context): Promise<void> {
	const startTime = Date.now();
	const messageText = getMessageText(ctx)!;
	const query = messageText.trim();
	const givenTicker = query.split("/price")[1]?.trim().replace("$", "") || null;

	const { id, tokenName } = await getTokenDetails(
		String(ctx.chat?.id),
		givenTicker,
	);

	if (!givenTicker && !id) {
		const isPrivate = ctx.chat?.type === "private";
		const prefix = isPrivate ? "" : `@${ctx.botInfo.username} `;

		await ctx.reply(
			`No token has been set yet.\n\nTo track a token for price monitoring, use:\n${prefix}/link https://www.coingecko.com/en/coins/bitcoin\n${prefix}/link https://iq.wiki/wiki/ethereum\n\nThen you can use ${prefix}/price without arguments.\n\nOr use: ${prefix}/price BTC`,
		);
		return;
	}

	const priceData = await fetchAndFormatTokenData(givenTicker, id);
	const duration = Date.now() - startTime;

	if (env.DATABASE_URL) {
		try {
			const platformChannelId = String(ctx.chat?.id);
			const bot = await telegramDb.getOrCreateBot(platformChannelId);

			const userAddress = `telegram_${ctx.from?.id}`;

			if (bot.teamId) {
				await telegramDb.createMessage({
					chatId: null,
					botId: bot.id,
					userAddress,
					query,
					answer: priceData,
					language: mapLanguageToCode("English"),
					duration,
					metadata: {
						tokenName,
						source: "coingecko",
						botData: {
							source: "telegram",
							platformChannelId,
						},
					},
					answerSources: id
						? [
								{
									title: "CoinGecko",
									url: `https://www.coingecko.com/en/coins/${id}`,
								},
							]
						: [],
				});
			}
		} catch (error) {
			console.error("Error storing price message:", error);
		}
	}

	try {
		await ctx.reply(priceData, { parse_mode: "HTML" });
	} catch (error) {
		console.error("Error sending price response:", error);
		await ctx.reply(
			"😕 Unable to send the formatted price data right now. Please try again in a moment.",
		);
	}
}

async function getTokenDetails(
	platformChannelId: string,
	givenTicker: string | null,
): Promise<{ id: string | null; tokenName: string | null }> {
	if (givenTicker) {
		return { id: null, tokenName: givenTicker };
	}

	if (!env.DATABASE_URL) {
		return { id: null, tokenName: null };
	}

	try {
		const bot = await telegramDb.getOrCreateBot(platformChannelId);

		if (!bot.teamId) {
			return { id: null, tokenName: null };
		}

		const links = (await telegramDb.getTeamLinks(bot.teamId)) as TokenLink[];

		const trackedToken = getPreferredToken(links);

		if (!trackedToken) {
			return { id: null, tokenName: null };
		}

		const tokenName = extractTokenName(trackedToken.url[0]);
		return { id: tokenName, tokenName };
	} catch (error) {
		console.error("[getTokenDetails] Error:", error);
		return { id: null, tokenName: null };
	}
}

function getPreferredToken(
	links: TokenLink[],
): { id: string; url: string[] } | null {
	const coingeckoToken = links.find((link) => link.id === "coingecko");
	if (coingeckoToken && coingeckoToken.url.length > 0) {
		return coingeckoToken;
	}

	const iqWikiToken = links.find((link) => link.id === "iq.wiki");
	if (iqWikiToken && iqWikiToken.url.length > 0) {
		return iqWikiToken;
	}

	return null;
}

function extractTokenName(url: string): string {
	try {
		const urlObj = new URL(url);

		if (urlObj.hostname.includes("coingecko.com")) {
			const match = urlObj.pathname.match(/\/coins\/([^/]+)/);
			if (match) return match[1];
		}

		if (urlObj.hostname.includes("iq.wiki")) {
			const match = urlObj.pathname.match(/\/wiki\/([^/]+)/);
			if (match) return match[1];
		}

		return "unknown";
	} catch {
		return "unknown";
	}
}

async function fetchAndFormatTokenData(
	givenTicker: string | null,
	id: string | null,
): Promise<string> {
	try {
		let identifier = id || givenTicker;
		let useTickerParam = !!givenTicker && !id;

		if (!identifier) {
			throw new Error("No token identifier provided");
		}

		if (givenTicker && TICKER_TO_ID_MAP[givenTicker.toLowerCase()]) {
			identifier = TICKER_TO_ID_MAP[givenTicker.toLowerCase()];
			useTickerParam = false;
		}

		const paramName = useTickerParam ? "symbols" : "ids";
		const searchParams = new URLSearchParams({
			vs_currency: "usd",
			[paramName]: identifier,
			price_change_percentage: "1h,24h,7d",
		});

		const coingeckoApiUrl = `https://pro-api.coingecko.com/api/v3/coins/markets?${searchParams.toString()}`;

		const gatewayUrl = new URL(env.IQ_GATEWAY_URL);
		gatewayUrl.searchParams.append("url", coingeckoApiUrl);
		gatewayUrl.searchParams.append("cacheDuration", "60");

		const response = await fetch(gatewayUrl.toString(), {
			headers: {
				"x-api-key": env.IQ_GATEWAY_KEY,
			},
		});

		if (!response.ok) {
			throw new Error(`API request failed: ${response.statusText}`);
		}

		const rawData = await response.json();

		const data = coingeckoResponseSchema.parse(rawData);

		if (!data || data.length === 0) {
			// If we used ids parameter and got no results, retry with symbols parameter
			if (!useTickerParam) {
				const retrySearchParams = new URLSearchParams({
					vs_currency: "usd",
					symbols: identifier,
					price_change_percentage: "1h,24h,7d",
				});

				const retryCoingeckoApiUrl = `https://pro-api.coingecko.com/api/v3/coins/markets?${retrySearchParams.toString()}`;
				const retryGatewayUrl = new URL(env.IQ_GATEWAY_URL);
				retryGatewayUrl.searchParams.append("url", retryCoingeckoApiUrl);
				retryGatewayUrl.searchParams.append("cacheDuration", "60");

				const retryResponse = await fetch(retryGatewayUrl.toString(), {
					headers: { "x-api-key": env.IQ_GATEWAY_KEY },
				});

				if (retryResponse.ok) {
					const retryData = coingeckoResponseSchema.parse(
						await retryResponse.json(),
					);
					if (retryData && retryData.length > 0) {
						return formatApiResponse(retryData[0]);
					}
				}
			}

			if (!givenTicker) {
				return "🔍 Unable to fetch price data from the linked token.\n\n💡 Try using the ticker symbol directly instead:\nExample: /price XRP or /price BTC\n\nOr update your link with /link command.";
			}
			return "🔍 Token not found!\n\n❓ The token identifier you entered doesn't exist. Please check the spelling and try again.\n\nExample: /price BTC or /price ETH";
		}

		return formatApiResponse(data[0]);
	} catch (error) {
		console.error("API Error:", error);
		return `😕 Unable to fetch price data. Please try again later.\n\nError: ${error instanceof Error ? error.message : "Unknown error"}`;
	}
}

function formatApiResponse(data: CoinGeckoData): string {
	const priceData = data;

	const {
		name,
		symbol,
		current_price,
		market_cap,
		market_cap_rank,
		total_volume,
	} = priceData;

	const formatMarketCap = () => {
		const hasRank = market_cap_rank && market_cap_rank !== -1;
		const hasCap = market_cap && market_cap > 0;

		if (!hasRank && !hasCap) {
			return "N/A";
		}

		const rankText = hasRank ? getOrdinal(market_cap_rank) : "Unranked";
		const capText = compactFormatter.format(market_cap || 0);

		return `${rankText} | ${capText}`;
	};

	return dedent`
		<b>${name} $${symbol.toUpperCase()} Token Overview</b>

		<b>💵 Price:</b> ${currencyFormatter.format(current_price ?? 0)}
		${formatChange(priceData.price_change_percentage_1h_in_currency ?? 0, "1h")}
		${formatChange(priceData.price_change_percentage_24h_in_currency ?? 0, "24h")}
		${formatChange(priceData.price_change_percentage_7d_in_currency ?? 0, "7d")}

		<b>🏙️ MCap:</b> ${formatMarketCap()}
		<b>💧 Vol:</b> ${compactFormatter.format(total_volume || 0)}
	`.trim();
}

function formatChange(change: number, duration: string): string {
	if (change == null) return "N/A";
	const sign = change >= 0 ? "+" : "";
	return `${change >= 0 ? "📈" : "📉"} <b>${duration}:</b> ${sign}${change.toFixed(2)}%`;
}

function getOrdinal(n: number): string {
	const s = ["th", "st", "nd", "rd"];
	const v = n % 100;
	return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
