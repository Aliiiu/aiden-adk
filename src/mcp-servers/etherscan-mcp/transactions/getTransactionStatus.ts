import z from "zod";
import { callEtherscanApi } from "../shared.js";

export const GetTransactionStatusInputSchema = z.object({
	txhash: z
		.string()
		.describe(
			"The string representing the transaction hash to check for execution status",
		),
	chainid: z.string().optional().default("1").describe("The chain ID to query"),
	action: z
		.enum(["getstatus", "gettxreceiptstatus"])
		.describe(
			"'getstatus' for contract execution status, 'gettxreceiptstatus' for transaction execution status",
		),
});

export type GetTransactionStatusInput = z.infer<
	typeof GetTransactionStatusInputSchema
>;

const ContractStatusSchema = z.object({
	isError: z.string().describe("'0' for success, '1' for error"),
	errDescription: z.string().describe("Error description if isError is '1'"),
});

const TransactionReceiptStatusSchema = z.object({
	status: z.string().describe("'1' for success, '0' for failure"),
});

const TransactionStatusResponseSchema = z.union([
	ContractStatusSchema,
	TransactionReceiptStatusSchema,
]);

export type GetTransactionStatusResponse = z.infer<
	typeof TransactionStatusResponseSchema
>;

/**
 * Check the status code of a contract or transaction execution.
 *
 * Returns execution status for either contract execution or transaction receipt.
 *
 * @param params.txhash - Transaction hash to check execution status
 * @param params.action - 'getstatus' for contract execution, 'gettxreceiptstatus' for transaction execution
 *
 * @returns For contract status: { isError: '0'|'1', errDescription: string }
 *          For transaction receipt: { status: '0'|'1' }
 *
 * @example
 * ```typescript
 * // Check contract execution status
 * const contractStatus = await getTransactionStatus({
 *   txhash: '0x15f8e5ea1079d9a0bb04a4c58ae5fe7654b5b2b4463375ff7ffb490aa0032f3a',
 *   action: 'getstatus'
 * });
 * // Returns: { isError: '0', errDescription: '' }
 *
 * // Check transaction receipt status
 * const txStatus = await getTransactionStatus({
 *   txhash: '0x15f8e5ea1079d9a0bb04a4c58ae5fe7654b5b2b4463375ff7ffb490aa0032f3a',
 *   action: 'gettxreceiptstatus'
 * });
 * // Returns: { status: '1' }
 * ```
 */
export async function getTransactionStatus(
	params: GetTransactionStatusInput,
): Promise<GetTransactionStatusResponse> {
	const { txhash, action, chainid } =
		GetTransactionStatusInputSchema.parse(params);

	return callEtherscanApi(
		{
			module: "transaction",
			action,
			txhash,
			chainid,
		},
		TransactionStatusResponseSchema,
	);
}
