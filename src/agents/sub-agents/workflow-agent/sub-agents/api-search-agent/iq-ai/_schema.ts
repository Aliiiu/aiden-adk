import z from "zod";

export const agentInfoSchema = z
	.object({
		id: z.string(),
		ticker: z.string(),
		name: z.string(),
		bio: z.string().optional(),
		framework: z.string().optional(),
		socials: z.any().optional(),
		isActive: z.boolean().optional(),
		governanceContract: z.string().optional(),
		tokenContract: z.string(),
		managerContract: z.string().optional(),
		poolContract: z.string().optional(),
		agentContract: z.string().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
		tokenUri: z.string().optional(),
		knowledge: z.union([z.string(), z.array(z.string())]).optional(),
		model: z.any().optional(),
		category: z.string().optional(),
		currentPriceInIq: z.number().optional(),
		inferenceCount: z.number().optional(),
		holdersCount: z.number().optional(),
		isVerified: z.boolean().optional(),
	})
	.loose();

export const agentStatsSchema = z
	.object({
		name: z.string(),
		currentPriceInIq: z.number().optional(),
		currentPriceInUSD: z.number().optional(),
		marketCap: z.number().optional(),
		changeIn24h: z.number().optional(),
		priceChangeIn24h: z.number().optional(),
		holdersCount: z.number().optional(),
		inferenceCount: z.number().optional(),
		category: z.string().optional(),
		totalSupply: z.number().optional(),
		performanceTimeline: z
			.object({
				"7d": z.number().optional(),
				"14d": z.number().optional(),
				"30d": z.number().optional(),
				"200d": z.number().optional(),
				"1y": z.number().optional(),
			})
			.optional(),
		tradingStats24h: z
			.object({
				high: z.number().optional(),
				low: z.number().optional(),
				volume: z.number().optional(),
			})
			.optional(),
		ath: z
			.object({
				price: z.number(),
				timestamp: z.string(),
			})
			.optional(),
		atl: z
			.object({
				price: z.number(),
				timestamp: z.string(),
			})
			.optional(),
	})
	.loose();

export const agentLogsSchema = z
	.object({
		logs: z.array(
			z.object({
				id: z.string(),
				agentId: z.string(),
				content: z.string(),
				type: z.string(),
				txHash: z.string().nullable().optional(),
				chainId: z.number().nullable().optional(),
				createdAt: z.string(),
			}),
		),
		total: z.number(),
		page: z.number(),
		totalPages: z.number(),
	})
	.loose();

export const allAgentsSchema = z
	.object({
		agents: z.array(
			z.object({
				id: z.string(),
				avatar: z.string().optional(),
				ticker: z.string(),
				name: z.string(),
				bio: z.string().optional(),
				socials: z.any().optional(),
				creatorId: z.string().optional(),
				isActive: z.boolean().optional(),
				governanceContract: z.string().optional(),
				tokenContract: z.string(),
				managerContract: z.string().optional(),
				poolContract: z.string().optional(),
				agentContract: z.string().optional(),
				createdAt: z.string().optional(),
				updatedAt: z.string().optional(),
				tokenUri: z.string().optional(),
				knowledge: z.array(z.string()).optional(),
				model: z.any().optional(),
				category: z.string().optional(),
				currentPriceInIq: z.number().optional(),
				currentPriceInUSD: z.number().optional(),
				inferenceCount: z.number().optional(),
				holdersCount: z.number().optional(),
				framework: z.string().optional(),
				volumeAllTime: z.number().optional(),
			}),
		),
		pagination: z
			.object({
				currentPage: z.number(),
				totalPages: z.number(),
				totalCount: z.number(),
				limit: z.number(),
				hasNextPage: z.boolean(),
				hasPreviousPage: z.boolean(),
			})
			.optional(),
	})
	.loose();

export const topAgentsSchema = z
	.object({
		agents: z.array(
			z.object({
				tokenContract: z.string(),
				agentContract: z.string().optional(),
				isActive: z.boolean().optional(),
				currentPriceInIq: z.number().optional(),
				currentPriceInUSD: z.number().optional(),
				holdersCount: z.number().optional(),
				inferenceCount: z.number().optional(),
				name: z.string(),
				ticker: z.string(),
			}),
		),
	})
	.loose();

export const holdingsSchema = z
	.object({
		count: z.number(),
		holdings: z.array(
			z.object({
				tokenContract: z.string(),
				tokenAmount: z.string(),
				name: z.string(),
				currentPriceInUsd: z.number(),
			}),
		),
	})
	.loose();

export const pricesSchema = z.record(
	z.string(),
	z.object({
		usd: z.number(),
	}),
);
