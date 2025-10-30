/**
 * Transaction Service
 * Handles transaction simulation and explanation operations
 */

import { createChildLogger } from "../../../lib/utils";
import { config } from "../config";
import type { PreExecResult, TransactionExplanation } from "../types";
import { BaseService } from "./base.service";

const logger = createChildLogger("DeBank Transaction Service");

const logAndWrapError = (context: string, error: unknown): Error => {
	if (error instanceof Error) {
		logger.error(context, error);
		return error;
	}

	const wrappedError = new Error(String(error));
	logger.error(context, wrappedError);
	return wrappedError;
};

export class TransactionService extends BaseService {
	async preExecTransaction(args: {
		tx: string;
		pending_tx_list?: string;
	}): Promise<string> {
		try {
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
			return await this.formatResponse(data, {
				title: "Transaction Simulation Result",
			});
		} catch (error) {
			throw logAndWrapError("Failed to simulate transaction", error);
		}
	}

	async explainTransaction(args: { tx: string }): Promise<string> {
		try {
			const body = {
				tx: JSON.parse(args.tx),
			};

			const data = await this.postWithToolConfig<TransactionExplanation>(
				`${config.baseUrl}/wallet/explain_tx`,
				body,
			);
			return await this.formatResponse(data, {
				title: "Transaction Explanation",
			});
		} catch (error) {
			throw logAndWrapError("Failed to explain transaction", error);
		}
	}
}
