import type { HistoricalPoolResponse, PoolsResponse } from "../types";
import { BaseService } from "./base.service";

/**
 * Yield Service
 * Handles yield farming pool data
 */
export class YieldService extends BaseService {
	/**
	 * Get historical pool data
	 */
	async getHistoricalPoolData(args: { pool: string }): Promise<string> {
		const data = await this.fetchData<HistoricalPoolResponse>(
			`${this.YIELDS_URL}/chart/${args.pool}`,
		);

		const last10 = data.data.slice(-10).map((item) => ({
			timestamp: item.timestamp,
			tvlUsd: item.tvlUsd,
			apy: item.apy,
			apyBase: item.apyBase,
		}));

		return await this.formatResponse(last10, {
			title: `Historical Pool Data: ${args.pool}`,
			currencyFields: ["tvlUsd"],
			numberFields: ["apy", "apyBase"],
		});
	}

	/**
	 * Get latest pool data with sorting and filtering
	 */
	async getLatestPoolData(args: {
		sortCondition: string;
		order: string;
		limit: number;
	}): Promise<string> {
		const data = await this.fetchData<PoolsResponse>(
			`${this.YIELDS_URL}/pools`,
		);

		const sorted = data.data.sort((a, b) => {
			const aVal = (a[args.sortCondition as keyof typeof a] as number) || 0;
			const bVal = (b[args.sortCondition as keyof typeof b] as number) || 0;
			return args.order === "asc" ? aVal - bVal : bVal - aVal;
		});

		const limited = sorted.slice(0, args.limit).map((pool) => ({
			chain: pool.chain,
			project: pool.project,
			tvlUsd: pool.tvlUsd,
			apyPct1D: pool.apyPct1D,
			apyPct7D: pool.apyPct7D,
			apyPct30D: pool.apyPct30D,
			apy: pool.apy,
			predictions: pool.predictions,
		}));

		return await this.formatResponse(limited, {
			title: `Top ${args.limit} Yield Pools`,
			currencyFields: ["tvlUsd"],
			numberFields: ["apy", "apyPct1D", "apyPct7D", "apyPct30D"],
		});
	}
}
