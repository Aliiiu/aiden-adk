import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const PreExecTransactionInputSchema = z.object({
	tx: z
		.string()
		.describe("Transaction payload encoded as JSON string (required)"),
	pending_tx_list: z
		.string()
		.optional()
		.describe(
			"Optional JSON string array of pending transactions for simulation context",
		),
});

const TokenTransferSchema = z
	.object({
		id: z.string(),
		chain: z.string(),
		name: z.string(),
		symbol: z.string(),
		amount: z.number(),
		price: z.number(),
	})
	.loose();

const NFTTransferSchema = z
	.object({
		id: z.string(),
		contract_id: z.string(),
		inner_id: z.string(),
		chain: z.string(),
		name: z.string(),
	})
	.loose();

export const PreExecTransactionResponseSchema = z.object({
	balance_change: z.object({
		success: z.boolean(),
		send_token_list: z.array(TokenTransferSchema),
		receive_token_list: z.array(TokenTransferSchema),
		send_nft_list: z.array(NFTTransferSchema),
		receive_nft_list: z.array(NFTTransferSchema),
		usd_value_change: z.number(),
	}),
	gas: z.object({
		success: z.boolean(),
		gas_used: z.number(),
		gas_limit: z.number(),
		gas_price: z.number(),
	}),
	pre_exec_version: z.string().describe("Simulation engine version"),
});

export type PreExecTransactionInput = z.infer<
	typeof PreExecTransactionInputSchema
>;
export type PreExecTransactionResponse = z.infer<
	typeof PreExecTransactionResponseSchema
>;

/**
 * Simulate transaction execution to preview balance changes, gas costs, and success/failure before submitting.
 *
 * Returns predicted balance changes (tokens/NFTs sent/received) and gas estimates. This is for validating
 * transactions before signing. For human-readable transaction explanation, use explainTransaction.
 * For historical transaction results, use getUserHistoryList.
 *
 * @param input.tx - Transaction payload as JSON string (from, to, data, value, gas, etc.)
 * @param input.pending_tx_list - Optional JSON array of pending txs for simulation context
 *
 * @returns Simulation: balance changes (send/receive tokens/NFTs, USD change), gas (used, limit, price), success status
 *
 * @example
 * ```typescript
 * const simulation = await preExecTransaction({
 *   tx: JSON.stringify({
 *     from: '0x...',
 *     to: '0x...',
 *     data: '0x...',
 *     value: '0x0'
 *   })
 * });
 * console.log(simulation.balance_change.usd_value_change); // Net USD change
 * console.log(simulation.gas.gas_used); // Estimated gas
 * ```
 */
export async function preExecTransaction(
	input: PreExecTransactionInput,
): Promise<PreExecTransactionResponse> {
	return executeServiceMethod(
		"transaction",
		"preExecTransaction",
		input,
	) as Promise<PreExecTransactionResponse>;
}
