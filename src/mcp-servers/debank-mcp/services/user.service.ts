/**
 * User Service
 * Handles all user-related operations including portfolios, balances, and history
 */

import type {
	NetCurvePoint,
	NFTAuthorization,
	TokenAuthorization,
	UserChainBalance,
	UserHistoryItem,
	UserNFT,
	UserProtocolPosition,
	UserTokenBalance,
	UserTotalBalance,
} from "../types";
import { BaseService } from "./base.service";

export class UserService extends BaseService {
	async getUserUsedChainList(args: { id: string }): Promise<string> {
		const data = await this.fetchWithToolConfig<{ chain_id: string }[]>(
			`${this.baseUrl}/user/used_chain_list?id=${args.id}`,
		);
		return await this.formatResponse(data, {
			title: `Chains Used by ${args.id}`,
		});
	}

	async getUserChainBalance(args: {
		id: string;
		chain_id: string;
	}): Promise<string> {
		const data = await this.fetchWithToolConfig<UserChainBalance>(
			`${this.baseUrl}/user/chain_balance?id=${args.id}&chain_id=${args.chain_id}`,
		);
		return await this.formatResponse(data, {
			title: `Balance on ${args.chain_id}`,
			currencyFields: ["usd_value"],
		});
	}

	async getUserProtocol(args: {
		id: string;
		protocol_id: string;
	}): Promise<string> {
		const data = await this.fetchWithToolConfig<UserProtocolPosition>(
			`${this.baseUrl}/user/protocol?id=${args.id}&protocol_id=${args.protocol_id}`,
		);
		return await this.formatResponse(data, {
			title: "Protocol Position",
			currencyFields: ["usd_value"],
		});
	}

	async getUserComplexProtocolList(args: {
		id: string;
		chain_id: string;
	}): Promise<string> {
		const data = await this.fetchWithToolConfig<UserProtocolPosition[]>(
			`${this.baseUrl}/user/complex_protocol_list?id=${args.id}&chain_id=${args.chain_id}`,
		);
		return await this.formatResponse(data, {
			title: `Complex Protocol Positions on ${args.chain_id}`,
			currencyFields: ["usd_value"],
		});
	}

	async getUserAllComplexProtocolList(args: {
		id: string;
		chain_ids?: string;
	}): Promise<string> {
		const url = args.chain_ids
			? `${this.baseUrl}/user/all_complex_protocol_list?id=${args.id}&chain_ids=${args.chain_ids}`
			: `${this.baseUrl}/user/all_complex_protocol_list?id=${args.id}`;

		const data = await this.fetchWithToolConfig<UserProtocolPosition[]>(url);
		return await this.formatResponse(data, {
			title: "All Complex Protocol Positions",
			currencyFields: ["usd_value"],
		});
	}

	async getUserAllSimpleProtocolList(args: {
		id: string;
		chain_ids?: string;
	}): Promise<string> {
		const url = args.chain_ids
			? `${this.baseUrl}/user/all_simple_protocol_list?id=${args.id}&chain_ids=${args.chain_ids}`
			: `${this.baseUrl}/user/all_simple_protocol_list?id=${args.id}`;

		const data = await this.fetchWithToolConfig<UserProtocolPosition[]>(url);
		return await this.formatResponse(data, {
			title: "Simple Protocol Positions",
			currencyFields: ["usd_value"],
		});
	}

	async getUserTokenBalance(args: {
		id: string;
		chain_id: string;
		token_id: string;
	}): Promise<string> {
		const data = await this.fetchWithToolConfig<UserTokenBalance>(
			`${this.baseUrl}/user/token?id=${args.id}&chain_id=${args.chain_id}&token_id=${args.token_id}`,
		);
		return await this.formatResponse(data, {
			title: `Token Balance: ${args.token_id}`,
			currencyFields: ["price", "usd_value"],
			numberFields: ["amount"],
		});
	}

	async getUserTokenList(args: {
		id: string;
		chain_id: string;
		is_all?: boolean;
		has_balance?: boolean;
	}): Promise<string> {
		const params = new URLSearchParams({
			id: args.id,
			chain_id: args.chain_id,
			...(args.is_all !== undefined && { is_all: args.is_all.toString() }),
			...(args.has_balance !== undefined && {
				has_balance: args.has_balance.toString(),
			}),
		});

		const data = await this.fetchWithToolConfig<UserTokenBalance[]>(
			`${this.baseUrl}/user/token_list?${params}`,
		);
		return await this.formatResponse(data, {
			title: `Token Holdings on ${args.chain_id}`,
			currencyFields: ["price", "usd_value"],
			numberFields: ["amount"],
		});
	}

	async getUserAllTokenList(args: {
		id: string;
		is_all?: boolean;
		has_balance?: boolean;
	}): Promise<string> {
		const params = new URLSearchParams({
			id: args.id,
			...(args.is_all !== undefined && { is_all: args.is_all.toString() }),
			...(args.has_balance !== undefined && {
				has_balance: args.has_balance.toString(),
			}),
		});

		const data = await this.fetchWithToolConfig<UserTokenBalance[]>(
			`${this.baseUrl}/user/all_token_list?${params}`,
		);
		return await this.formatResponse(data, {
			title: "All Token Holdings",
			currencyFields: ["price", "usd_value"],
			numberFields: ["amount"],
		});
	}

	async getUserNftList(args: {
		id: string;
		chain_id: string;
		is_all?: boolean;
	}): Promise<string> {
		const params = new URLSearchParams({
			id: args.id,
			chain_id: args.chain_id,
			...(args.is_all !== undefined && { is_all: args.is_all.toString() }),
		});

		const data = await this.fetchWithToolConfig<UserNFT[]>(
			`${this.baseUrl}/user/nft_list?${params}`,
		);
		return await this.formatResponse(data, {
			title: `NFT Collection on ${args.chain_id}`,
			numberFields: ["amount"],
		});
	}

	async getUserAllNftList(args: {
		id: string;
		is_all?: boolean;
		chain_ids?: string;
	}): Promise<string> {
		const params = new URLSearchParams({
			id: args.id,
			...(args.is_all !== undefined && { is_all: args.is_all.toString() }),
			...(args.chain_ids !== undefined && { chain_ids: args.chain_ids }),
		});

		const data = await this.fetchWithToolConfig<UserNFT[]>(
			`${this.baseUrl}/user/all_nft_list?${params}`,
		);
		return await this.formatResponse(data, {
			title: "All NFT Holdings",
			numberFields: ["amount"],
		});
	}

	async getUserHistoryList(args: {
		id: string;
		chain_id: string;
		start_time?: number;
		end_time?: number;
		page_count?: number;
	}): Promise<string> {
		const params = new URLSearchParams({
			id: args.id,
			chain_id: args.chain_id,
			...(args.start_time !== undefined && {
				start_time: args.start_time.toString(),
			}),
			...(args.end_time !== undefined && {
				end_time: args.end_time.toString(),
			}),
			...(args.page_count !== undefined && {
				page_count: args.page_count.toString(),
			}),
		});

		const data = await this.fetchWithToolConfig<UserHistoryItem[]>(
			`${this.baseUrl}/user/history_list?${params}`,
		);
		return await this.formatResponse(data, {
			title: `Transaction History on ${args.chain_id}`,
		});
	}

	async getUserAllHistoryList(args: {
		id: string;
		start_time?: number;
		end_time?: number;
		page_count?: number;
	}): Promise<string> {
		const params = new URLSearchParams({
			id: args.id,
			...(args.start_time !== undefined && {
				start_time: args.start_time.toString(),
			}),
			...(args.end_time !== undefined && {
				end_time: args.end_time.toString(),
			}),
			...(args.page_count !== undefined && {
				page_count: args.page_count.toString(),
			}),
		});

		const data = await this.fetchWithToolConfig<UserHistoryItem[]>(
			`${this.baseUrl}/user/all_history_list?${params}`,
		);
		return await this.formatResponse(data, {
			title: "Complete Transaction History",
		});
	}

	async getUserTokenAuthorizedList(args: { id: string }): Promise<string> {
		const data = await this.fetchWithToolConfig<TokenAuthorization[]>(
			`${this.baseUrl}/user/token_authorized_list?id=${args.id}`,
		);
		return await this.formatResponse(data, {
			title: "Token Authorizations",
		});
	}

	async getUserNftAuthorizedList(args: { id: string }): Promise<string> {
		const data = await this.fetchWithToolConfig<NFTAuthorization[]>(
			`${this.baseUrl}/user/nft_authorized_list?id=${args.id}`,
		);
		return await this.formatResponse(data, {
			title: "NFT Authorizations",
		});
	}

	async getUserTotalBalance(args: { id: string }): Promise<string> {
		const data = await this.fetchWithToolConfig<UserTotalBalance>(
			`${this.baseUrl}/user/total_balance?id=${args.id}`,
		);
		return await this.formatResponse(data, {
			title: "Total Portfolio Balance",
			currencyFields: ["total_usd_value"],
		});
	}

	async getUserChainNetCurve(args: {
		id: string;
		chain_id: string;
	}): Promise<string> {
		const data = await this.fetchWithToolConfig<NetCurvePoint[]>(
			`${this.baseUrl}/user/chain_net_curve?id=${args.id}&chain_id=${args.chain_id}`,
		);
		return await this.formatResponse(data, {
			title: `Portfolio Value Over Time (${args.chain_id})`,
			currencyFields: ["usd_value"],
		});
	}

	async getUserTotalNetCurve(args: {
		id: string;
		chain_ids?: string;
	}): Promise<string> {
		const url = args.chain_ids
			? `${this.baseUrl}/user/total_net_curve?id=${args.id}&chain_ids=${args.chain_ids}`
			: `${this.baseUrl}/user/total_net_curve?id=${args.id}`;

		const data = await this.fetchWithToolConfig<{
			usd_value_list: NetCurvePoint[];
		}>(url);
		return this.formatResponse(data.usd_value_list, {
			title: "Total Portfolio Value Over Time",
			currencyFields: ["usd_value"],
		});
	}
}
