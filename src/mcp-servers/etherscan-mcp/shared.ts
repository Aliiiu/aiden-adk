import { type ZodSchema, z } from "zod";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const BASE_URL = "https://api.etherscan.io/v2/api";

/**
 * Make a request to the Etherscan API
 */
export async function callEtherscanApi<T>(
	params: Record<string, unknown>,
	schema: ZodSchema<T>,
): Promise<T> {
	const queryParams = {
		...params,
		apikey: ETHERSCAN_API_KEY,
	};

	const queryEntries = Object.entries(queryParams)
		.filter(([_, v]) => v !== undefined && v !== null)
		.map(([k, v]) => [k, String(v)]) as [string, string][];

	const queryString = new URLSearchParams(queryEntries).toString();
	const url = `${BASE_URL}?${queryString}`;

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Etherscan API request failed: ${response.statusText}`);
	}

	const data = (await response.json()) as unknown;

	const parsedEnvelope = z
		.object({
			status: z.string(),
			message: z.string().optional(),
			result: z.unknown(),
		})
		.safeParse(data);

	if (!parsedEnvelope.success) {
		throw new Error("Etherscan API response was not in the expected format");
	}

	// Etherscan returns { status: "1", message: "OK", result: ... } for success
	// and { status: "0", message: "Error message", result: ... } for errors
	if (parsedEnvelope.data.status === "0") {
		throw new Error(
			`Etherscan API error: ${parsedEnvelope.data.message || parsedEnvelope.data.result}`,
		);
	}

	return schema.parse(parsedEnvelope.data.result);
}
