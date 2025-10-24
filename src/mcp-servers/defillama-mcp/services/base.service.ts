import type { CacheEntry } from "../types";

/**
 * Base Service for DefiLlama API
 * Provides common caching and data fetching functionality
 */
export abstract class BaseService {
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

	protected formatResponse(
		data: unknown,
		options?: {
			title?: string;
			currencyFields?: string[];
			numberFields?: string[];
		},
	): string {
		const { toMarkdown } = require("../../../lib/utils/markdown-formatter");
		return toMarkdown(data, options);
	}
}
