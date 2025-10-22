/**
 * DeBank API Handlers
 * Implementation of all DeBank API functions using IQ Gateway
 */

import { env } from "../../env";
import { config } from "./config";
import type {
	ChainInfo,
	GasMarket,
	NetCurvePoint,
	NFTAuthorization,
	PoolInfo,
	PreExecResult,
	ProtocolHolder,
	ProtocolInfo,
	TokenAuthorization,
	TokenHistoricalPrice,
	TokenHolder,
	TokenInfo,
	TransactionExplanation,
	UserChainBalance,
	UserHistoryItem,
	UserNFT,
	UserProtocolPosition,
	UserTokenBalance,
	UserTotalBalance,
} from "./types";

/**
 * Helper function to fetch data from API through IQ Gateway
 */
const fetchWithToolConfig = async <T>(
	url: string,
	cacheDuration = config.debankDefaultLifeTime,
): Promise<T> => {
	const proxyUrl = new URL(env.IQ_GATEWAY_URL);
	proxyUrl.searchParams.append("url", url);
	proxyUrl.searchParams.append("cacheDuration", cacheDuration.toString());

	const gatewayUrl = proxyUrl.href;

	const response = await fetch(gatewayUrl, {
		headers: {
			"Content-Type": "application/json",
			"x-api-key": env.IQ_GATEWAY_KEY,
		},
	});

	if (!response.ok) {
		throw new Error(await response.text());
	}

	const result = (await response.json()) as { data: T };
	return result.data;
};

/**
 * Helper function for POST requests through IQ Gateway
 */
const postWithToolConfig = async <T>(
	url: string,
	body: unknown,
): Promise<T> => {
	const proxyUrl = new URL(env.IQ_GATEWAY_URL);
	proxyUrl.searchParams.append("url", url);
	proxyUrl.searchParams.append("method", "POST");

	const gatewayUrl = proxyUrl.href;

	const response = await fetch(gatewayUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-api-key": env.IQ_GATEWAY_KEY,
		},
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		throw new Error(await response.text());
	}

	const result = (await response.json()) as { data: T };
	return result.data;
};

/**
 * Chain Endpoints
 */
export const getChain = async (args: { id: string }): Promise<string> => {
	const data = await fetchWithToolConfig<ChainInfo>(
		`${config.baseUrl}/chain?id=${args.id}`,
		config.supportedChainListLifeTime,
	);
	return JSON.stringify({ chain: data });
};

export const getSupportedChainList = async (): Promise<string> => {
	const data = await fetchWithToolConfig<ChainInfo[]>(
		`${config.baseUrl}/chain/list`,
		config.supportedChainListLifeTime,
	);
	return JSON.stringify({ chains: data, totalCount: data.length });
};

/**
 * Protocol Endpoints
 */
export const getProtocolInformation = async (args: {
	id: string;
}): Promise<string> => {
	const data = await fetchWithToolConfig<ProtocolInfo>(
		`${config.baseUrl}/protocol?id=${args.id}`,
	);
	return JSON.stringify({ protocol: data });
};

export const getAllProtocolsOfSupportedChains = async (args: {
	chain_ids?: string;
}): Promise<string> => {
	const url = args.chain_ids
		? `${config.baseUrl}/protocol/all_list?chain_ids=${args.chain_ids}`
		: `${config.baseUrl}/protocol/all_list`;

	const data = await fetchWithToolConfig<ProtocolInfo[]>(
		url,
		config.protocolsListLifeTime,
	);

	return JSON.stringify({
		protocols: data.slice(0, 20),
		totalCount: data.length,
	});
};

export const getTopHoldersOfProtocol = async (args: {
	id: string;
	start?: number;
	limit?: number;
}): Promise<string> => {
	const params = new URLSearchParams({ id: args.id });
	if (args.start !== undefined) params.append("start", args.start.toString());
	if (args.limit !== undefined) params.append("limit", args.limit.toString());

	const data = await fetchWithToolConfig<ProtocolHolder[]>(
		`${config.baseUrl}/protocol/top_holders?${params.toString()}`,
	);

	return JSON.stringify({ topHolders: data, count: data.length });
};

/**
 * Pool Endpoints
 */
export const getPoolInformation = async (args: {
	id: string;
	chain_id: string;
}): Promise<string> => {
	const data = await fetchWithToolConfig<PoolInfo>(
		`${config.baseUrl}/pool?id=${args.id}&chain_id=${args.chain_id}`,
		config.poolDataLifeTime,
	);
	return JSON.stringify({ pool: data });
};

/**
 * Token Endpoints
 */
export const getTokenInformation = async (args: {
	chain_id: string;
	id: string;
}): Promise<string> => {
	const data = await fetchWithToolConfig<TokenInfo>(
		`${config.baseUrl}/token?chain_id=${args.chain_id}&id=${args.id}`,
	);
	return JSON.stringify({ token: data });
};

export const getListTokenInformation = async (args: {
	chain_id: string;
	ids: string;
}): Promise<string> => {
	const data = await fetchWithToolConfig<TokenInfo[]>(
		`${config.baseUrl}/token/list_by_ids?chain_id=${args.chain_id}&ids=${args.ids}`,
	);
	return JSON.stringify({ tokens: data, count: data.length });
};

export const getTopHoldersOfToken = async (args: {
	id: string;
	chain_id: string;
	start?: number;
	limit?: number;
}): Promise<string> => {
	const params = new URLSearchParams({
		id: args.id,
		chain_id: args.chain_id,
	});
	if (args.start !== undefined) params.append("start", args.start.toString());
	if (args.limit !== undefined) params.append("limit", args.limit.toString());

	const data = await fetchWithToolConfig<TokenHolder[]>(
		`${config.baseUrl}/token/top_holders?${params.toString()}`,
	);

	return JSON.stringify({ topHolders: data, count: data.length });
};

export const getTokenHistoryPrice = async (args: {
	id: string;
	chain_id: string;
	date_at: string;
}): Promise<string> => {
	const data = await fetchWithToolConfig<TokenHistoricalPrice>(
		`${config.baseUrl}/token/history_price?id=${args.id}&chain_id=${args.chain_id}&date_at=${args.date_at}`,
	);
	return JSON.stringify({ historicalPrice: data });
};

/**
 * User Endpoints
 */
export const getUserUsedChainList = async (args: {
	id: string;
}): Promise<string> => {
	const data = await fetchWithToolConfig<ChainInfo[]>(
		`${config.baseUrl}/user/used_chain_list?id=${args.id}`,
	);
	return JSON.stringify({ chains: data, count: data.length });
};

export const getUserChainBalance = async (args: {
	chain_id: string;
	id: string;
}): Promise<string> => {
	const data = await fetchWithToolConfig<UserChainBalance>(
		`${config.baseUrl}/user/chain_balance?chain_id=${args.chain_id}&id=${args.id}`,
	);
	return JSON.stringify({ balance: data });
};

export const getUserProtocol = async (args: {
	protocol_id: string;
	id: string;
}): Promise<string> => {
	const data = await fetchWithToolConfig<UserProtocolPosition>(
		`${config.baseUrl}/user/protocol?protocol_id=${args.protocol_id}&id=${args.id}`,
	);
	return JSON.stringify({ protocolPosition: data });
};

export const getUserComplexProtocolList = async (args: {
	chain_id: string;
	id: string;
}): Promise<string> => {
	const data = await fetchWithToolConfig<UserProtocolPosition[]>(
		`${config.baseUrl}/user/complex_protocol_list?chain_id=${args.chain_id}&id=${args.id}`,
	);
	return JSON.stringify({ protocols: data, count: data.length });
};

export const getUserAllComplexProtocolList = async (args: {
	id: string;
	chain_ids?: string;
}): Promise<string> => {
	const url = args.chain_ids
		? `${config.baseUrl}/user/all_complex_protocol_list?id=${args.id}&chain_ids=${args.chain_ids}`
		: `${config.baseUrl}/user/all_complex_protocol_list?id=${args.id}`;

	const data = await fetchWithToolConfig<UserProtocolPosition[]>(url);
	return JSON.stringify({ protocols: data, count: data.length });
};

export const getUserAllSimpleProtocolList = async (args: {
	id: string;
	chain_ids?: string;
}): Promise<string> => {
	const url = args.chain_ids
		? `${config.baseUrl}/user/all_simple_protocol_list?id=${args.id}&chain_ids=${args.chain_ids}`
		: `${config.baseUrl}/user/all_simple_protocol_list?id=${args.id}`;

	const data = await fetchWithToolConfig<ProtocolInfo[]>(url);
	return JSON.stringify({ protocols: data, count: data.length });
};

export const getUserTokenBalance = async (args: {
	chain_id: string;
	id: string;
	token_id: string;
}): Promise<string> => {
	const data = await fetchWithToolConfig<UserTokenBalance>(
		`${config.baseUrl}/user/token?chain_id=${args.chain_id}&id=${args.id}&token_id=${args.token_id}`,
	);
	return JSON.stringify({ tokenBalance: data });
};

export const getUserTokenList = async (args: {
	id: string;
	chain_id: string;
	is_all?: boolean;
}): Promise<string> => {
	const params = new URLSearchParams({
		id: args.id,
		chain_id: args.chain_id,
	});
	if (args.is_all !== undefined)
		params.append("is_all", args.is_all.toString());

	const data = await fetchWithToolConfig<UserTokenBalance[]>(
		`${config.baseUrl}/user/token_list?${params.toString()}`,
	);
	return JSON.stringify({ tokens: data, count: data.length });
};

export const getUserAllTokenList = async (args: {
	id: string;
	is_all?: boolean;
}): Promise<string> => {
	const params = new URLSearchParams({ id: args.id });
	if (args.is_all !== undefined)
		params.append("is_all", args.is_all.toString());

	const data = await fetchWithToolConfig<UserTokenBalance[]>(
		`${config.baseUrl}/user/all_token_list?${params.toString()}`,
	);
	return JSON.stringify({ tokens: data, count: data.length });
};

export const getUserNftList = async (args: {
	id: string;
	chain_id: string;
	is_all?: boolean;
}): Promise<string> => {
	const params = new URLSearchParams({
		id: args.id,
		chain_id: args.chain_id,
	});
	if (args.is_all !== undefined)
		params.append("is_all", args.is_all.toString());

	const data = await fetchWithToolConfig<UserNFT[]>(
		`${config.baseUrl}/user/nft_list?${params.toString()}`,
	);
	return JSON.stringify({ nfts: data, count: data.length });
};

export const getUserAllNftList = async (args: {
	id: string;
	is_all?: boolean;
	chain_ids?: string;
}): Promise<string> => {
	const params = new URLSearchParams({ id: args.id });
	if (args.is_all !== undefined)
		params.append("is_all", args.is_all.toString());
	if (args.chain_ids) params.append("chain_ids", args.chain_ids);

	const data = await fetchWithToolConfig<UserNFT[]>(
		`${config.baseUrl}/user/all_nft_list?${params.toString()}`,
	);
	return JSON.stringify({ nfts: data, count: data.length });
};

export const getUserHistoryList = async (args: {
	id: string;
	chain_id: string;
	token_id?: string;
	start_time?: number;
	page_count?: number;
}): Promise<string> => {
	const params = new URLSearchParams({
		id: args.id,
		chain_id: args.chain_id,
	});
	if (args.token_id) params.append("token_id", args.token_id);
	if (args.start_time !== undefined)
		params.append("start_time", args.start_time.toString());
	if (args.page_count !== undefined)
		params.append("page_count", args.page_count.toString());

	const data = await fetchWithToolConfig<UserHistoryItem[]>(
		`${config.baseUrl}/user/history_list?${params.toString()}`,
	);
	return JSON.stringify({ history: data, count: data.length });
};

export const getUserAllHistoryList = async (args: {
	id: string;
	start_time?: number;
	page_count?: number;
	chain_ids?: string;
}): Promise<string> => {
	const params = new URLSearchParams({ id: args.id });
	if (args.start_time !== undefined)
		params.append("start_time", args.start_time.toString());
	if (args.page_count !== undefined)
		params.append("page_count", args.page_count.toString());
	if (args.chain_ids) params.append("chain_ids", args.chain_ids);

	const data = await fetchWithToolConfig<UserHistoryItem[]>(
		`${config.baseUrl}/user/all_history_list?${params.toString()}`,
	);
	return JSON.stringify({ history: data, count: data.length });
};

export const getUserTokenAuthorizedList = async (args: {
	id: string;
	chain_id: string;
}): Promise<string> => {
	const data = await fetchWithToolConfig<TokenAuthorization[]>(
		`${config.baseUrl}/user/token_authorized_list?id=${args.id}&chain_id=${args.chain_id}`,
	);
	return JSON.stringify({ authorizations: data, count: data.length });
};

export const getUserNftAuthorizedList = async (args: {
	id: string;
	chain_id: string;
}): Promise<string> => {
	const data = await fetchWithToolConfig<NFTAuthorization[]>(
		`${config.baseUrl}/user/nft_authorized_list?id=${args.id}&chain_id=${args.chain_id}`,
	);
	return JSON.stringify({ authorizations: data, count: data.length });
};

export const getUserTotalBalance = async (args: {
	id: string;
}): Promise<string> => {
	const data = await fetchWithToolConfig<UserTotalBalance>(
		`${config.baseUrl}/user/total_balance?id=${args.id}`,
	);
	return JSON.stringify({ totalBalance: data });
};

export const getUserChainNetCurve = async (args: {
	id: string;
	chain_id: string;
}): Promise<string> => {
	const data = await fetchWithToolConfig<NetCurvePoint[]>(
		`${config.baseUrl}/user/chain_net_curve?id=${args.id}&chain_id=${args.chain_id}`,
	);
	return JSON.stringify({ netCurve: data, count: data.length });
};

export const getUserTotalNetCurve = async (args: {
	id: string;
	chain_ids?: string;
}): Promise<string> => {
	const url = args.chain_ids
		? `${config.baseUrl}/user/total_net_curve?id=${args.id}&chain_ids=${args.chain_ids}`
		: `${config.baseUrl}/user/total_net_curve?id=${args.id}`;

	const data = await fetchWithToolConfig<NetCurvePoint[]>(url);
	return JSON.stringify({ netCurve: data, count: data.length });
};

/**
 * Wallet Endpoints
 */
export const getGasPrices = async (args: {
	chain_id: string;
}): Promise<string> => {
	const data = await fetchWithToolConfig<GasMarket>(
		`${config.baseUrl}/wallet/gas_market?chain_id=${args.chain_id}`,
		config.gasPriceLifeTime,
	);
	return JSON.stringify({ gasPrices: data });
};

export const preExecTransaction = async (args: {
	tx: string;
	pending_tx_list?: string;
}): Promise<string> => {
	const body = {
		tx: JSON.parse(args.tx),
		...(args.pending_tx_list && {
			pending_tx_list: JSON.parse(args.pending_tx_list),
		}),
	};

	const data = await postWithToolConfig<PreExecResult>(
		`${config.baseUrl}/wallet/pre_exec_tx`,
		body,
	);
	return JSON.stringify({ preExecResult: data });
};

export const explainTransaction = async (args: {
	tx: string;
}): Promise<string> => {
	const body = {
		tx: JSON.parse(args.tx),
	};

	const data = await postWithToolConfig<TransactionExplanation>(
		`${config.baseUrl}/wallet/explain_tx`,
		body,
	);
	return JSON.stringify({ explanation: data });
};
