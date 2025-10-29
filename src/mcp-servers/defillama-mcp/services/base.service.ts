import type { LanguageModel } from "ai";
import { Tiktoken } from "js-tiktoken/lite";
import cl100k_base from "js-tiktoken/ranks/cl100k_base";
import { createChildLogger } from "../../../lib/utils";
import { LLMDataFilter } from "../../debank-mcp/utils/data-filter";
import { config } from "../config";
import type { CacheEntry } from "../types";

const logger = createChildLogger("DefiLlama Base Service");

// Initialize tiktoken encoder for token counting
const encoder = new Tiktoken(cl100k_base);

/**
 * Base Service for DefiLlama API
 * Provides common caching and data fetching functionality
 */
export abstract class BaseService {
	protected aiModel?: LanguageModel;
	protected dataFilter?: LLMDataFilter;
	protected currentQuery?: string;

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

	protected readonly BASE_URL = "https://api.llama.fi";
	protected readonly COINS_URL = "https://coins.llama.fi";
	protected readonly STABLECOINS_URL = "https://stablecoins.llama.fi";
	protected readonly YIELDS_URL = "https://yields.llama.fi";
	protected readonly DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

	private cache = new Map<string, CacheEntry>();

	protected async getCachedData<T>(
		key: string,
		fetcher: () => Promise<T>,
		ttlMs: number = this.DEFAULT_CACHE_TTL_MS,
	): Promise<T> {
		const cached = this.cache.get(key);
		if (cached && cached.expiresAt > Date.now()) {
			return cached.data as T;
		}

		const data = await fetcher();
		this.cache.set(key, { data, expiresAt: Date.now() + ttlMs });
		return data;
	}

	protected async fetchData<T>(url: string): Promise<T> {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`API request failed: ${response.statusText}`);
		}
		return (await response.json()) as T;
	}

	protected toUnixSeconds(value: string | number): number {
		if (typeof value === "number") {
			return Math.floor(value);
		}

		const trimmed = value.trim();
		if (/^\d+$/.test(trimmed)) {
			return Math.floor(Number(trimmed));
		}

		const parsed = Date.parse(trimmed);
		if (Number.isNaN(parsed)) {
			throw new Error(`Invalid timestamp value: ${value}`);
		}

		return Math.floor(parsed / 1000);
	}

	/**
	 * Format response for LLM consumption
	 * Returns MCP-compliant response with content array
	 * Automatically filters large responses if AI model is configured
	 * Uses currentQuery set via setQuery() for filtering context
	 */
	protected async formatResponse(
		data: unknown,
		options?: {
			title?: string;
			currencyFields?: string[];
			numberFields?: string[];
		},
	): Promise<string> {
		const { toMarkdown } = require("../../../lib/utils/markdown-formatter");
		let markdownOutput = toMarkdown(data, options);

		const tokenLength = encoder.encode(markdownOutput).length;
		logger.info(`Response token length: ${tokenLength}`);
		logger.info(
			`Response token need filtering: ${tokenLength > config.maxTokens ? "Yes" : "No"}`,
		);
		logger.info(
			`User query for filtering: ${this.currentQuery ? "Yes" : "No"}`,
		);
		logger.info(`Data filter configured: ${this.dataFilter ? "Yes" : "No"}`);

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
				markdownOutput = toMarkdown(JSON.parse(filteredJson), {
					title: options?.title,
					currencyFields: options?.currencyFields,
					numberFields: options?.numberFields,
				});

				const tokenLength = encoder.encode(markdownOutput).length;
				logger.info(`New Response token length: ${tokenLength}`);

				return markdownOutput;
			} catch (error) {
				console.error("Error filtering response:", error);
				return markdownOutput;
			}
		}

		return markdownOutput;
	}
}
