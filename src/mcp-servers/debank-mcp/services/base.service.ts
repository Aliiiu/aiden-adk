/**
 * Base Service Class
 * Provides common functionality for all DeBank services
 */

import axios from "axios";
import { env } from "../../../env";
import { config } from "../config";

export abstract class BaseService {
	protected baseUrl = config.baseUrl;

	/**
	 * Helper function to fetch data from API through IQ Gateway
	 */
	protected async fetchWithToolConfig<T>(
		url: string,
		cacheDuration = config.debankDefaultLifeTime,
	): Promise<T> {
		const proxyUrl = new URL(env.IQ_GATEWAY_URL);
		proxyUrl.searchParams.append("url", url);
		proxyUrl.searchParams.append("projectName", "debank_mcp");
		proxyUrl.searchParams.append("cacheDuration", cacheDuration.toString());

		const gatewayUrl = proxyUrl.href;

		try {
			const response = await axios.get<T>(gatewayUrl, {
				headers: {
					"Content-Type": "application/json",
					"x-api-key": env.IQ_GATEWAY_KEY,
				},
			});

			return response.data;
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				const errorPayload = error.response?.data ?? error.message;
				const errorMessage =
					typeof errorPayload === "string"
						? errorPayload
						: JSON.stringify(errorPayload);
				throw new Error(errorMessage);
			}
			throw error instanceof Error ? error : new Error(String(error));
		}
	}

	/**
	 * Helper function for POST requests through IQ Gateway
	 */
	protected async postWithToolConfig<T>(
		url: string,
		body: unknown,
	): Promise<T> {
		const proxyUrl = new URL(env.IQ_GATEWAY_URL);
		proxyUrl.searchParams.append("url", url);
		proxyUrl.searchParams.append("method", "POST");

		const gatewayUrl = proxyUrl.href;

		const response = await fetch(gatewayUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": env.IQ_GATEWAY_KEY,
			},
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			throw new Error(await response.text());
		}

		return (await response.json()) as T;
	}

	/**
	 * Format response as markdown for LLM consumption
	 */
	protected formatResponse(
		data: unknown,
		options?: {
			title?: string;
			currencyFields?: string[];
			numberFields?: string[];
		},
	): string {
		const { toMarkdown } = require("./markdown-formatter");
		return toMarkdown(data, options);
	}
}
