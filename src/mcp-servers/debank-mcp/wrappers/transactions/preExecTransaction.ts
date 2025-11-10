/**
 * Simulate transaction execution before submitting
 */

import { executeServiceMethod } from "../../shared.js";

/**
 * Simulate the execution of a transaction before submitting on-chain
 *
 * @param params.tx - Transaction object as JSON string
 * @param params.pending_tx_list - Optional JSON array of pending transactions
 *
 * @returns Simulation results including balance changes and gas estimates
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
 * console.log(simulation);
 * ```
 */
export async function preExecTransaction(params: {
	tx: string;
	pending_tx_list?: string;
}): Promise<any> {
	return executeServiceMethod("transaction", "preExecTransaction", params);
}
