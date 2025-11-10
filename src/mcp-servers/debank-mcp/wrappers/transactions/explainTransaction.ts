/**
 * Decode and explain a transaction
 */

import { executeServiceMethod } from "../../shared.js";

/**
 * Decode and explain a transaction in human-readable terms
 *
 * @param params.tx - Transaction object as JSON string
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
export async function explainTransaction(params: { tx: string }): Promise<any> {
	return executeServiceMethod("transaction", "explainTransaction", params);
}
