/**
 * Transaction Service
 * Handles transaction simulation and explanation operations
 */

import { config } from "../config";
import type { PreExecResult, TransactionExplanation } from "../types";
import { BaseService } from "./base.service";

export class TransactionService extends BaseService {
	async preExecTransaction(args: {
		tx: string;
		pending_tx_list?: string;
	}): Promise<string> {
		const body = {
			tx: JSON.parse(args.tx),
			...(args.pending_tx_list && {
				pending_tx_list: JSON.parse(args.pending_tx_list),
			}),
		};

		const data = await this.postWithToolConfig<PreExecResult>(
			`${config.baseUrl}/wallet/pre_exec_tx`,
			body,
		);
		return this.formatResponse(data, {
			title: "Transaction Simulation Result",
		});
	}

	async explainTransaction(args: { tx: string }): Promise<string> {
		const body = {
			tx: JSON.parse(args.tx),
		};

		const data = await this.postWithToolConfig<TransactionExplanation>(
			`${config.baseUrl}/wallet/explain_tx`,
			body,
		);
		return this.formatResponse(data, {
			title: "Transaction Explanation",
		});
	}
}
