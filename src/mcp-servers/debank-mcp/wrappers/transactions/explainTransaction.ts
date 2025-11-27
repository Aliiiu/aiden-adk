import { z } from "zod";
import { executeServiceMethod } from "../../shared.js";

export const ExplainTransactionInputSchema = z.object({
	tx: z
		.string()
		.describe(
			"Transaction payload in JSON string format (matching DeBank's wallet/explain_tx schema)",
		),
});

const TransactionActionSchema = z.object({
	type: z.string().describe("Action type (e.g., 'transfer', 'swap')"),
	data: z
		.record(z.string(), z.unknown())
		.describe("Action-specific details in key/value form"),
});

export const ExplainTransactionResponseSchema = z.object({
	action_type: z.string().describe("Primary action type for the transaction"),
	contract_protocol_name: z
		.string()
		.describe("Protocol name associated with the transaction"),
	contract_protocol_logo_url: z.string().describe("Protocol logo URL"),
	actions: z
		.array(TransactionActionSchema)
		.describe("Step-by-step breakdown of the transaction"),
});

export type ExplainTransactionInput = z.infer<
	typeof ExplainTransactionInputSchema
>;
export type ExplainTransactionResponse = z.infer<
	typeof ExplainTransactionResponseSchema
>;

/**
 * Decode and explain a transaction payload in human-readable terms with protocol and action details.
 *
 * Returns step-by-step breakdown of what a transaction will do. This is for understanding transaction intent
 * before signing. For simulating execution results (balance changes, gas), use preExecTransaction.
 * For historical transactions of a wallet, use getUserHistoryList.
 *
 * @param input.tx - Transaction payload as JSON string (from, to, data, value, etc.)
 *
 * @returns Human-readable explanation: action type, protocol name/logo, step-by-step actions
 *
 * @example
 * ```typescript
 * const explanation = await explainTransaction({
 *   tx: JSON.stringify({
 *     from: '0x...',
 *     to: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // Uniswap
 *     data: '0x...'
 *   })
 * });
 * console.log(explanation.action_type); // e.g., 'swap'
 * console.log(explanation.actions); // Step-by-step breakdown
 * ```
 */
export async function explainTransaction(
	input: ExplainTransactionInput,
): Promise<ExplainTransactionResponse> {
	return executeServiceMethod(
		"transaction",
		"explainTransaction",
		input,
	) as Promise<ExplainTransactionResponse>;
}
