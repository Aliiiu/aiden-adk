import { config } from "../config";
import type { ChainInfo, GasMarket } from "../types";
import { BaseService } from "./base.service";

export class ChainService extends BaseService {
	async getChain(args: { id: string }): Promise<string> {
		const data = await this.fetchWithToolConfig<ChainInfo>(
			`${this.baseUrl}/chain?id=${args.id}`,
			config.chainDataLifeTime,
		);
		return await this.formatResponse(data, {
			title: `Chain Information: ${data.name}`,
		});
	}

	async getSupportedChainList(): Promise<string> {
		const data = await this.fetchWithToolConfig<ChainInfo[]>(
			`${this.baseUrl}/chain/list`,
			config.supportedChainListLifeTime,
		);
		return await this.formatResponse(data, {
			title: "Supported Chains",
		});
	}

	async getGasPrices(args: { chain_id: string }): Promise<string> {
		const data = await this.fetchWithToolConfig<GasMarket>(
			`${this.baseUrl}/gas_market?chain_id=${args.chain_id}`,
			config.gasPriceLifeTime,
		);
		return await this.formatResponse(data, {
			title: `Gas Prices for Chain: ${args.chain_id}`,
			numberFields: ["price", "front_tx_count", "estimated_seconds"],
		});
	}
}
