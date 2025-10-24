import type {
	BatchHistoricalResponse,
	ChartResponse,
	CurrentPricesResponse,
	FirstPricesResponse,
	PercentageResponse,
} from "../types";
import { BaseService } from "./base.service";

/**
 * Price Service
 * Handles cryptocurrency token price data
 */
export class PriceService extends BaseService {
	/**
	 * Get current prices for coins
	 */
	async getPricesCurrentCoins(args: {
		coins: string;
		searchWidth?: string | number;
	}): Promise<string> {
		const coinsSegment = encodeURIComponent(args.coins);
		const params = new URLSearchParams();

		if (args.searchWidth !== undefined) {
			params.append("searchWidth", String(args.searchWidth));
		}

		const url = `${this.COINS_URL}/prices/current/${coinsSegment}${
			params.toString() ? `?${params.toString()}` : ""
		}`;

		const data = await this.fetchData<CurrentPricesResponse>(url);
		return this.formatResponse(data, {
			title: "Current Coin Prices",
			currencyFields: ["price"],
		});
	}

	/**
	 * Get first recorded prices for coins
	 */
	async getPricesFirstCoins(args: { coins: string }): Promise<string> {
		const url = `${this.COINS_URL}/prices/first/${args.coins}`;
		const data = await this.fetchData<FirstPricesResponse>(url);
		return this.formatResponse(data, {
			title: "First Recorded Prices",
			currencyFields: ["price"],
		});
	}

	/**
	 * Get batch historical prices
	 */
	async getBatchHistorical(args: {
		coins: string;
		searchWidth?: string | number;
	}): Promise<string> {
		const params = new URLSearchParams({
			coins: args.coins,
		});

		if (args.searchWidth !== undefined) {
			params.append("searchWidth", String(args.searchWidth));
		}

		const url = `${this.COINS_URL}/batchHistorical?${params.toString()}`;

		const data = await this.fetchData<BatchHistoricalResponse>(url);
		return this.formatResponse(data, {
			title: "Batch Historical Prices",
			currencyFields: ["price"],
		});
	}

	/**
	 * Get historical prices by contract address at specific timestamp
	 */
	async getHistoricalPricesByContractAddress(args: {
		coins: string;
		timestamp: string | number;
		searchWidth?: string | number;
	}): Promise<string> {
		const unixTime = this.toUnixSeconds(args.timestamp);
		const coinsSegment = encodeURIComponent(args.coins);
		const params = new URLSearchParams();

		if (args.searchWidth !== undefined) {
			params.append("searchWidth", String(args.searchWidth));
		}

		const url = `${this.COINS_URL}/prices/historical/${unixTime}/${coinsSegment}${
			params.toString() ? `?${params.toString()}` : ""
		}`;

		const data = await this.fetchData<CurrentPricesResponse>(url);
		return this.formatResponse(data, {
			title: `Historical Prices at ${new Date(unixTime * 1000).toISOString()}`,
			currencyFields: ["price"],
		});
	}

	/**
	 * Get percentage price change for coins
	 */
	async getPercentageCoins(args: {
		coins: string;
		period?: string;
		lookForward?: boolean;
		timestamp?: string | number;
	}): Promise<string> {
		const coinsSegment = encodeURIComponent(args.coins);
		const params = new URLSearchParams();

		if (args.period) params.append("period", args.period);
		if (args.lookForward) params.append("lookForward", "true");
		if (args.timestamp) {
			const unixTime = this.toUnixSeconds(args.timestamp);
			params.append("timestamp", unixTime.toString());
		}

		const url = `${this.COINS_URL}/percentage/${coinsSegment}${
			params.toString() ? `?${params.toString()}` : ""
		}`;
		const data = await this.fetchData<PercentageResponse>(url);
		return this.formatResponse(data, {
			title: "Price Percentage Change",
			numberFields: ["percentage"],
		});
	}

	/**
	 * Get chart data for coins
	 */
	async getChartCoins(args: {
		coins: string;
		start?: string | number;
		end?: string | number;
		span?: number;
		period?: string;
		searchWidth?: string | number;
	}): Promise<string> {
		let url = `${this.COINS_URL}/chart/${args.coins}`;
		const params = new URLSearchParams();

		if (args.start !== undefined) params.append("start", String(args.start));
		if (args.end !== undefined) params.append("end", String(args.end));
		if (args.span !== undefined) params.append("span", args.span.toString());
		if (args.period) params.append("period", args.period);
		if (args.searchWidth !== undefined)
			params.append("searchWidth", String(args.searchWidth));

		if (params.toString()) url += `?${params.toString()}`;

		const data = await this.fetchData<ChartResponse>(url);
		return this.formatResponse(data, {
			title: "Price Chart Data",
			currencyFields: ["price"],
		});
	}
}
