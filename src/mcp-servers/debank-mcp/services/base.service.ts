/**
 * Base Service Class
 * Provides common functionality for all DeBank services
 */

import type { LanguageModel } from "ai";
import axios from "axios";
import { Tiktoken } from "js-tiktoken/lite";
import cl100k_base from "js-tiktoken/ranks/cl100k_base";
import { env } from "../../../env";
import { createChildLogger } from "../../../lib/utils";
import { toMarkdown } from "../../../lib/utils/markdown-formatter";
import { config } from "../config";
import { LLMDataFilter } from "../utils/data-filter";

const logger = createChildLogger("DeBank Base Service");

const encoder = new Tiktoken(cl100k_base);

export type FormatOptions = {
	title?: string;
	currencyFields?: string[];
	numberFields?: string[];
};

export abstract class BaseService {
	protected baseUrl = config.baseUrl;
	protected aiModel?: LanguageModel;
	protected dataFilter?: LLMDataFilter;
	protected currentQuery?: string;
	private rawOutputMode = false;

	/**
	 * Set the AI model for data filtering
	 * Call this method to enable automatic filtering of large responses
	 */
	setAIModel(model: LanguageModel) {
		this.aiModel = model;
		this.dataFilter = new LLMDataFilter({ model });
	}

	/**
	 * Set the current user query for context-aware filtering
	 * This should be called before making service requests
	 */
	setQuery(query: string) {
		this.currentQuery = query;
	}

	/**
	 * Enable or disable raw output mode
	 * When enabled, service methods return raw JSON data instead of formatted strings
	 * This is used for sandbox code execution
	 */
	setRawOutputMode(enabled: boolean) {
		this.rawOutputMode = enabled;
	}

	/**
	 * Check if raw output mode is enabled
	 */
	protected get isRawOutputMode(): boolean {
		return this.rawOutputMode;
	}

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
	 * Format response for LLM consumption or return raw data
	 * - If rawOutputMode is enabled: always returns raw data (for sandbox execution)
	 * - Otherwise: returns MCP-compliant formatted string
	 * Automatically filters large responses if AI model is configured
	 * Uses currentQuery set via setQuery() for filtering context
	 */
	async formatResponse(
		data: unknown,
		options?: FormatOptions,
	): Promise<unknown> {
		if (this.rawOutputMode) {
			return data;
		}

		const markdownOutput = toMarkdown(data, options ?? {});

		const tokenLength = encoder.encode(markdownOutput).length;

		logger.info(`Response token length: ${tokenLength}`);
		logger.info(
			`Need to filter: ${this.dataFilter && this.currentQuery && tokenLength > config.maxTokens ? "yes" : "no"}`,
		);

		if (
			tokenLength > config.maxTokens &&
			this.dataFilter &&
			this.currentQuery
		) {
			try {
				const jsonData = JSON.stringify(data);
				const filteredJson = await this.dataFilter.filter(
					jsonData,
					this.currentQuery,
				);

				logger.info("Successfully filtered response data");
				logger.info(`New token length: ${encoder.encode(filteredJson).length}`);

				return toMarkdown(JSON.parse(filteredJson), options ?? {});
			} catch (error) {
				console.error("Error filtering response:", error);
				return markdownOutput;
			}
		}

		return markdownOutput;
	}
}
