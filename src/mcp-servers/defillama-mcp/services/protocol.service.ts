import type { ChainData, HistoricalChainTvlItem, ProtocolData } from "../types";
import { BaseService } from "./base.service";

/**
 * Protocol & TVL Service
 * Handles protocol data, chain information, and historical TVL data
 */
export class ProtocolService extends BaseService {
	/**
	 * Get chains ranked by TVL
	 */
	async getChains(args: { order: "asc" | "desc" }): Promise<string> {
		const data = await this.getCachedData<ChainData[]>("chains", () =>
			this.fetchData<ChainData[]>(`${this.BASE_URL}/v2/chains`),
		);

		const sorted = [...data].sort((a, b) => {
			return args.order === "asc" ? a.tvl - b.tvl : b.tvl - a.tvl;
		});

		const top20 = sorted.slice(0, 20).map((chain) => ({
			name: chain.name,
			tvl: chain.tvl,
		}));

		return await this.formatResponse(top20, {
			title: "Top 20 Chains by TVL",
			currencyFields: ["tvl"],
		});
	}

	/**
	 * Get protocol data - specific protocol or top protocols
	 */
	async getProtocolData(args: {
		protocol?: string;
		sortCondition: "change_1h" | "change_1d" | "change_7d" | "tvl";
		order: "asc" | "desc";
	}): Promise<string> {
		if (args.protocol) {
			// Protocol slug is already resolved by autoResolveEntities at the tool layer
			const protocolSlug = args.protocol;

			try {
				const data = await this.getCachedData(`protocol:${protocolSlug}`, () =>
					this.fetchData<ProtocolData>(
						`${this.BASE_URL}/protocol/${protocolSlug}`,
					),
				);

				// Extract only essential fields to reduce response size
				const essentialData = {
					id: data.id,
					name: data.name,
					symbol: data.symbol,
					category: data.category,
					chains: data.chains,
					tvl: data.tvl,
					chainTvls: data.chainTvls,
					change_1h: data.change_1h,
					change_1d: data.change_1d,
					change_7d: data.change_7d,
					currentChainTvls: data.currentChainTvls,
					mcap: data.mcap,
				};

				return await this.formatResponse(essentialData, {
					title: `Protocol: ${data.name}`,
					currencyFields: ["tvl", "mcap"],
					numberFields: ["change_1h", "change_1d", "change_7d"],
				});
			} catch (_error) {
				return await this.formatResponse(
					{
						error: "Failed to fetch protocol data",
						message: `Failed to fetch data for protocol "${protocolSlug}". The protocol may not exist or the API request failed.`,
						protocolSlug,
					},
					{
						title: "Error: API Request Failed",
					},
				);
			}
		}

		const data = await this.getCachedData<ProtocolData[]>("protocols", () =>
			this.fetchData<ProtocolData[]>(`${this.BASE_URL}/protocols`),
		);

		const sorted = [...data].sort((a, b) => {
			const aVal = a[args.sortCondition] || 0;
			const bVal = b[args.sortCondition] || 0;
			return args.order === "asc" ? aVal - bVal : bVal - aVal;
		});

		const top10 = sorted.slice(0, 10).map((protocol) => ({
			name: protocol.name,
			symbol: protocol.symbol,
			tvl: protocol.tvl,
			chainTvls: protocol.chainTvls,
			change_1h: protocol.change_1h,
			change_1d: protocol.change_1d,
			change_7d: protocol.change_7d,
			currentChainTvls: protocol.currentChainTvls,
		}));

		return await this.formatResponse(top10, {
			title: `Top 10 Protocols by ${args.sortCondition}`,
			currencyFields: ["tvl"],
			numberFields: ["change_1h", "change_1d", "change_7d"],
		});
	}

	/**
	 * Get historical chain TVL data
	 */
	async getHistoricalChainTvl(args: { chain?: string }): Promise<string> {
		const url = args.chain
			? `${this.BASE_URL}/v2/historicalChainTvl/${args.chain}`
			: `${this.BASE_URL}/v2/historicalChainTvl`;

		const data = await this.fetchData<HistoricalChainTvlItem[]>(url);
		const last10 = data.slice(-10).map((item) => ({
			date: item.date,
			tvl: item.tvl,
		}));

		return await this.formatResponse(last10, {
			title: args.chain
				? `Historical TVL: ${args.chain}`
				: "Historical TVL (All Chains)",
			currencyFields: ["tvl"],
		});
	}
}
