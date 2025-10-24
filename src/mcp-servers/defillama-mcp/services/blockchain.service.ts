import { BaseService } from "./base.service";

/**
 * Blockchain Service
 * Handles blockchain block and timestamp data
 */
export class BlockchainService extends BaseService {
	async getBlockChainTimestamp(args: {
		chain: string;
		timestamp: string | number;
	}): Promise<string> {
		const unixTime = this.toUnixSeconds(args.timestamp);
		const url = `${this.COINS_URL}/block/${args.chain}/${unixTime}`;

		const data = await this.fetchData(url);
		return this.formatResponse(data, {
			title: `Block Data: ${args.chain} at ${new Date(unixTime * 1000).toISOString()}`,
			numberFields: ["height", "timestamp"],
		});
	}
}
