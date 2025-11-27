import axios from "axios";
import { type ZodType, z } from "zod";
import { env } from "../../env.js";

const BASE_URL = "https://api.etherscan.io/v2/api";

/**
 * Make a request to the Etherscan API using IQ Gateway proxy
 */
export async function callEtherscanApi<T>(
	params: Record<string, unknown>,
	schema: ZodType<T>,
	cacheDurationSeconds: number = 3600, // 1 hour default cache
): Promise<T> {
	const queryParams = {
		...params,
	};

	const queryEntries = Object.entries(queryParams)
		.filter(([_, v]) => v !== undefined && v !== null)
		.map(([k, v]) => [k, String(v)]) as [string, string][];

	const queryString = new URLSearchParams(queryEntries).toString();
	const etherscanUrl = `${BASE_URL}?${queryString}`;

	const proxyUrl = new URL(env.IQ_GATEWAY_URL);
	proxyUrl.searchParams.append("url", etherscanUrl);
	proxyUrl.searchParams.append("projectName", "etherscan_mcp");
	if (cacheDurationSeconds >= 0) {
		proxyUrl.searchParams.append(
			"cacheDuration",
			Math.floor(cacheDurationSeconds).toString(),
		);
	}

	try {
		const response = await axios.get(proxyUrl.href, {
			headers: {
				"Content-Type": "application/json",
				"x-api-key": env.IQ_GATEWAY_KEY,
			},
		});

		const data = response.data;

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
			const errorMsg = parsedEnvelope.data.message || "Unknown error";
			const errorResult =
				typeof parsedEnvelope.data.result === "string"
					? parsedEnvelope.data.result
					: JSON.stringify(parsedEnvelope.data.result);
			throw new Error(
				`Etherscan API error: ${errorMsg}${errorResult ? ` - ${errorResult}` : ""}`,
			);
		}

		const parsedResult = schema.parse(parsedEnvelope.data.result);

		// Some endpoints (e.g., transaction status) return errors inside the result
		// even when the envelope status is "1". Surface those as errors here.
		if (parsedResult && typeof parsedResult === "object") {
			const maybeResult = parsedResult as Record<string, unknown>;
			const isErrorField = maybeResult.isError;
			const statusField = maybeResult.status;

			if (typeof isErrorField === "string" && isErrorField.trim() === "1") {
				const errDescription =
					typeof maybeResult.errDescription === "string"
						? maybeResult.errDescription
						: "unknown error";
				throw new Error(
					`Etherscan API error (result.isError=1): ${errDescription}`,
				);
			}

			if (typeof statusField === "string" && statusField.trim() === "0") {
				throw new Error(
					"Etherscan API error (result.status=0): transaction/receipt indicates failure",
				);
			}
		}

		return parsedResult;
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			const errorPayload = error.response?.data ?? error.message;
			const errorMessage =
				typeof errorPayload === "string"
					? errorPayload
					: JSON.stringify(errorPayload);
			throw new Error(`Etherscan API request failed: ${errorMessage}`);
		}
		throw error instanceof Error ? error : new Error(String(error));
	}
}
