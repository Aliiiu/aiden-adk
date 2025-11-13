/**
 * Decode and explain a transaction
 */

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
 * Decode and explain a transaction in human-readable terms
 *
 * @param input.tx - Transaction object as JSON string
 *
 * @returns Human-readable explanation of the transaction
 *
 * @example
 * ```typescript
 * const explanation = await explainTransaction({
 *   tx: JSON.stringify({
 *     from: '0x...',
 *     to: '0x...',
 *     data: '0x...'
 *   })
 * });
 * console.log(explanation);
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
