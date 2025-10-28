import { config } from "../config";
import type { PoolInfo, ProtocolHolder, ProtocolInfo } from "../types";
import { BaseService } from "./base.service";

export class ProtocolService extends BaseService {
	async getProtocolInformation(args: { id: string }): Promise<string> {
		const data = await this.fetchWithToolConfig<ProtocolInfo>(
			`${this.baseUrl}/protocol?id=${args.id}`,
		);
		return await this.formatResponse(data, {
			title: `Protocol Information: ${data.name || args.id}`,
			currencyFields: ["tvl"],
		});
	}

	async getAllProtocolsOfSupportedChains(args: {
		chain_ids?: string;
	}): Promise<string> {
		const url = args.chain_ids
			? `${this.baseUrl}/protocol/all_list?chain_ids=${args.chain_ids}`
			: `${this.baseUrl}/protocol/all_list`;

		const data = await this.fetchWithToolConfig<ProtocolInfo[]>(
			url,
			config.protocolsListLifeTime,
		);
		return await this.formatResponse(data, {
			title: args.chain_ids
				? `Protocols on Chains: ${args.chain_ids}`
				: "All Supported Protocols",
			currencyFields: ["tvl"],
		});
	}

	async getTopHoldersOfProtocol(args: {
		id: string;
		start?: number;
		limit?: number;
	}): Promise<string> {
		const params = new URLSearchParams({
			id: args.id,
			...(args.start !== undefined && { start: args.start.toString() }),
			...(args.limit !== undefined && { limit: args.limit.toString() }),
		});

		const data = await this.fetchWithToolConfig<ProtocolHolder[]>(
			`${this.baseUrl}/protocol/top_holders?${params}`,
		);
		return await this.formatResponse(data, {
			title: `Top Holders of Protocol: ${args.id}`,
			currencyFields: ["usd_value"],
		});
	}

	async getPoolInformation(args: {
		id: string;
		chain_id: string;
	}): Promise<string> {
		const data = await this.fetchWithToolConfig<PoolInfo>(
			`${this.baseUrl}/pool?id=${args.id}&chain_id=${args.chain_id}`,
			config.poolDataLifeTime,
		);
		return await this.formatResponse(data, {
			title: `Pool Information: ${data.name || args.id}`,
			currencyFields: ["tvl"],
		});
	}
}
