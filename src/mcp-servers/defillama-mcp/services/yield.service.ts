import { createChildLogger } from "../../../lib/utils";
import type { HistoricalPoolResponse, PoolsResponse } from "../types";
import { BaseService } from "./base.service";

const logger = createChildLogger("DefiLlama Yield Service");

const logAndWrapError = (context: string, error: unknown): Error => {
	if (error instanceof Error) {
		logger.error(context, error);
		return error;
	}

	const wrappedError = new Error(String(error));
	logger.error(context, wrappedError);
	return wrappedError;
};

/**
 * Yield Service
 * Handles yield farming pool data
 */
export class YieldService extends BaseService {
	/**
	 * Get historical pool data
	 */
	async getHistoricalPoolData(args: { pool: string }): Promise<string> {
		try {
			const data = await this.fetchData<HistoricalPoolResponse>(
				`${this.YIELDS_URL}/chart/${args.pool}`,
			);

			const last10 = data.data.slice(-10).map((item) => ({
				poolId: args.pool,
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
		} catch (error) {
			throw logAndWrapError(
				`Failed to fetch historical pool data for ${args.pool}`,
				error,
			);
		}
	}

	/**
	 * Get latest pool data with sorting and filtering
	 */
	async getLatestPoolData(args: {
		sortCondition: string;
		order: string;
		limit: number;
	}): Promise<string> {
		try {
			const data = await this.fetchData<PoolsResponse>(
				`${this.YIELDS_URL}/pools`,
			);

			const sorted = data.data.sort((a, b) => {
				const aVal = (a[args.sortCondition as keyof typeof a] as number) || 0;
				const bVal = (b[args.sortCondition as keyof typeof b] as number) || 0;
				return args.order === "asc" ? aVal - bVal : bVal - aVal;
			});

			const limited = sorted.slice(0, args.limit).map((pool) => ({
				name: pool.project ?? pool.symbol ?? null,
				project: pool.project ?? null,
				chain: pool.chain ?? null,
				id: pool.pool ?? null,
				symbol: pool.symbol ?? null,
				tvlUsd: pool.tvlUsd ?? null,
				tvl: pool.tvlUsd ?? null, // alias for agents expecting `tvl`
				apyPct1D: pool.apyPct1D ?? null,
				apy1d: pool.apyPct1D ?? null,
				apyPct7D: pool.apyPct7D ?? null,
				apy7d: pool.apyPct7D ?? null,
				apyPct30D: pool.apyPct30D ?? null,
				apy30d: pool.apyPct30D ?? null,
				apy: pool.apy ?? null,
				predictions: pool.predictions ?? null,
			}));

			return await this.formatResponse(limited, {
				title: `Top ${args.limit} Yield Pools`,
				currencyFields: ["tvlUsd"],
				numberFields: ["apy", "apyPct1D", "apyPct7D", "apyPct30D"],
			});
		} catch (error) {
			throw logAndWrapError("Failed to fetch latest yield pool data", error);
		}
	}
}
