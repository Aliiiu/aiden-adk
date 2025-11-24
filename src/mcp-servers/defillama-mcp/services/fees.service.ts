import { createChildLogger } from "../../../lib/utils";
import type { FeesOverviewResponse } from "../types";
import { BaseService } from "./base.service";

const logger = createChildLogger("DefiLlama Fees Service");

const logAndWrapError = (context: string, error: unknown): Error => {
	if (error instanceof Error) {
		logger.error(context, error);
		return error;
	}

	const wrappedError = new Error(String(error));
	logger.error(context, wrappedError);
	return wrappedError;
};

export class FeesService extends BaseService {
	async getFeesAndRevenue(args: {
		excludeTotalDataChart?: boolean;
		excludeTotalDataChartBreakdown?: boolean;
		dataType?: string;
		chain?: string;
		protocol?: string;
		sortCondition: string;
		order: "asc" | "desc";
	}): Promise<unknown> {
		try {
			const excludeTotalDataChart =
				args.excludeTotalDataChart !== undefined
					? args.excludeTotalDataChart
					: true;
			const excludeTotalDataChartBreakdown =
				args.excludeTotalDataChartBreakdown !== undefined
					? args.excludeTotalDataChartBreakdown
					: true;
			const dataType = args.dataType ?? "dailyFees";

			const params = new URLSearchParams({
				excludeTotalDataChart: String(excludeTotalDataChart),
				excludeTotalDataChartBreakdown: String(excludeTotalDataChartBreakdown),
				dataType,
			});

			if (args.protocol) {
				const url = `${this.BASE_URL}/summary/fees/${args.protocol}?${params.toString()}`;
				const data = await this.fetchData<FeesOverviewResponse>(url);

				return await this.formatResponse(data, {
					title: `Fees & Revenue: ${args.protocol}`,
					numberFields: ["change_1d", "change_7d", "change_1m"],
				});
			}

			const url = args.chain
				? `${this.BASE_URL}/overview/fees/${args.chain}?${params.toString()}`
				: `${this.BASE_URL}/overview/fees?${params.toString()}`;
			const data = await this.fetchData<FeesOverviewResponse>(url);

			return await this.processFeesResponse(data, args);
		} catch (error) {
			const target =
				args.protocol ??
				(args.chain ? `chain ${args.chain}` : "global overview");
			throw logAndWrapError(
				`Failed to fetch fees and revenue data for ${target}`,
				error,
			);
		}
	}

	private async processFeesResponse(
		data: FeesOverviewResponse,
		args: { sortCondition: string; order: "asc" | "desc"; chain?: string },
	): Promise<unknown> {
		if (data.protocols) {
			const sorted = data.protocols.sort((a, b) => {
				const aVal = (a[args.sortCondition as keyof typeof a] as number) || 0;
				const bVal = (b[args.sortCondition as keyof typeof b] as number) || 0;
				return args.order === "asc" ? aVal - bVal : bVal - aVal;
			});

			const formattedProtocols = sorted.map((protocol) => ({
				name: protocol.name,
				slug: protocol.slug,
				id: protocol.id ?? protocol.defillamaId,
				total24h: protocol.total24h,
				total48hto24h: protocol.total48hto24h,
				total7d: protocol.total7d,
				total14dto7d: protocol.total14dto7d,
				total30d: protocol.total30d,
				total60dto30d: protocol.total60dto30d,
				total1y: protocol.total1y,
				totalAllTime: protocol.totalAllTime,
				change_1d: protocol.change_1d,
				change_7d: protocol.change_7d,
				change_1m: protocol.change_1m,
			}));

			const title = args.chain
				? `Protocols by Fees: ${args.chain}`
				: "Protocols by Fees";

			return await this.formatResponse(formattedProtocols, {
				title,
				numberFields: ["change_1d", "change_7d", "change_1m"],
			});
		}

		return await this.formatResponse(data, {
			title: "Fees & Revenue Data",
		});
	}
}
