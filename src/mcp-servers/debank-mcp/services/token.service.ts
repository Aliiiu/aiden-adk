/**
 * Token Service
 * Handles all token-related operations
 */

import type { TokenHistoricalPrice, TokenHolder, TokenInfo } from "../types";
import { BaseService } from "./base.service";

export class TokenService extends BaseService {
	async getTokenInformation(args: {
		id: string;
		chain_id: string;
	}): Promise<string> {
		const data = await this.fetchWithToolConfig<TokenInfo>(
			`${this.baseUrl}/token?id=${args.id}&chain_id=${args.chain_id}`,
		);
		return this.formatResponse(data, {
			title: `Token Information: ${data.name || args.id}`,
			currencyFields: ["price"],
			numberFields: ["decimals"],
		});
	}

	async getListTokenInformation(args: {
		chain_id: string;
		ids: string;
	}): Promise<string> {
		const data = await this.fetchWithToolConfig<TokenInfo[]>(
			`${this.baseUrl}/token/list?chain_id=${args.chain_id}&ids=${args.ids}`,
		);
		return this.formatResponse(data, {
			title: `Token List (${data.length} tokens)`,
			currencyFields: ["price"],
			numberFields: ["decimals"],
		});
	}

	async getTopHoldersOfToken(args: {
		id: string;
		chain_id: string;
		start?: number;
		limit?: number;
	}): Promise<string> {
		const params = new URLSearchParams({
			id: args.id,
			chain_id: args.chain_id,
			...(args.start !== undefined && { start: args.start.toString() }),
			...(args.limit !== undefined && { limit: args.limit.toString() }),
		});

		const data = await this.fetchWithToolConfig<TokenHolder[]>(
			`${this.baseUrl}/token/top_holders?${params}`,
		);
		return this.formatResponse(data, {
			title: `Top Holders of Token: ${args.id}`,
			currencyFields: ["usd_value"],
			numberFields: ["amount"],
		});
	}

	async getTokenHistoryPrice(args: {
		id: string;
		chain_id: string;
		date_at: string;
	}): Promise<string> {
		const data = await this.fetchWithToolConfig<TokenHistoricalPrice>(
			`${this.baseUrl}/token/history_price?id=${args.id}&chain_id=${args.chain_id}&date_at=${args.date_at}`,
		);
		return this.formatResponse(data, {
			title: `Historical Price for ${args.id} on ${args.date_at}`,
			currencyFields: ["price"],
		});
	}
}
