import type { OptionsOverviewResponse } from "../types";
import { BaseService } from "./base.service";

/**
 * Options Service
 * Handles options protocol data
 */
export class OptionsService extends BaseService {
	/**
	 * Get options protocol data
	 */
	async getOptionsData(args: {
		sortCondition: string;
		order: "asc" | "desc";
		dataType: string;
		chain?: string;
		protocol?: string;
		excludeTotalDataChart?: boolean;
		excludeTotalDataChartBreakdown?: boolean;
	}): Promise<string> {
		const excludeTotalDataChart =
			args.excludeTotalDataChart !== undefined
				? args.excludeTotalDataChart
				: true;
		const excludeTotalDataChartBreakdown =
			args.excludeTotalDataChartBreakdown !== undefined
				? args.excludeTotalDataChartBreakdown
				: true;
		const dataType = args.dataType ?? "dailyNotionalVolume";

		const params = new URLSearchParams({
			excludeTotalDataChart: String(excludeTotalDataChart),
			excludeTotalDataChartBreakdown: String(excludeTotalDataChartBreakdown),
			dataType,
		});

		if (args.protocol) {
			const summaryParams = new URLSearchParams({
				dataType,
			});
			const url = `${this.BASE_URL}/summary/options/${args.protocol}?${summaryParams.toString()}`;
			const data = await this.fetchData<OptionsOverviewResponse>(url);

			return this.formatResponse(data, {
				title: `Options Protocol: ${args.protocol}`,
				currencyFields: ["total24h", "total7d", "total30d"],
				numberFields: ["change_1d", "change_7d", "change_1m"],
			});
		}

		const url = args.chain
			? `${this.BASE_URL}/overview/options/${args.chain}?${params.toString()}`
			: `${this.BASE_URL}/overview/options?${params.toString()}`;
		const data = await this.fetchData<OptionsOverviewResponse>(url);

		return this.processOptionsResponse(data, args);
	}

	/**
	 * Process options response and format top protocols
	 */
	private processOptionsResponse(
		data: OptionsOverviewResponse,
		args: { sortCondition: string; order: "asc" | "desc"; chain?: string },
	): string {
		if (data.protocols) {
			const sorted = data.protocols.sort((a, b) => {
				const aVal = (a[args.sortCondition as keyof typeof a] as number) || 0;
				const bVal = (b[args.sortCondition as keyof typeof b] as number) || 0;
				return args.order === "asc" ? aVal - bVal : bVal - aVal;
			});

			const top10 = sorted.slice(0, 10);

			const title = args.chain
				? `Top 10 Options Protocols: ${args.chain}`
				: "Top 10 Options Protocols";

			return this.formatResponse(top10, {
				title,
				currencyFields: ["total24h", "total7d", "total30d"],
				numberFields: ["change_1d", "change_7d", "change_1m"],
			});
		}

		return this.formatResponse(data, {
			title: "Options Data",
		});
	}
}
