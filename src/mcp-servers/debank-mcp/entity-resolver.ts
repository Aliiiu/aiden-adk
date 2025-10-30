import { google } from "@ai-sdk/google";
import { GoogleAICacheManager } from "@google/generative-ai/server";
import { generateText } from "ai";
import endent from "endent";
import { createChildLogger } from "../../lib/utils";
import { chainIds } from "./enums/chains";

const logger = createChildLogger("DeBank Entity Resolver");
const gemini25Flash = "gemini-2.5-flash";
const NOT_FOUND_TOKEN = "__NOT_FOUND__";

// Cache manager for Gemini context caching
let cacheManager: GoogleAICacheManager | null = null;
let cachedContentName: string | null = null;

/**
 * Initializes the Gemini cache manager and creates cached content for chain list
 * This caches the chain enum list to reduce token costs and improve performance
 */
async function initializeCacheManager(): Promise<void> {
	if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
		logger.warn(
			"GOOGLE_GENERATIVE_AI_API_KEY not found, caching will be disabled",
		);
		return;
	}

	try {
		cacheManager = new GoogleAICacheManager(
			process.env.GOOGLE_GENERATIVE_AI_API_KEY,
		);

		// Prepare chain list for caching with additional context to meet minimum token requirement
		// Google AI requires minimum 1024 tokens for caching
		const chainList = chainIds
			.map((chain) => `${chain.name}: ${chain.id}`)
			.join("\n");

		const systemInstruction = endent`
			You are a blockchain chain resolver for DeBank API integration.
			Your task is to match user-provided blockchain names to their corresponding DeBank chain IDs.

			DeBank supports 145+ blockchain networks across various ecosystems including:
			- Layer 1 blockchains (Ethereum, BNB Chain, Solana, etc.)
			- Layer 2 scaling solutions (Arbitrum, Optimism, zkSync, Polygon zkEVM, etc.)
			- Alternative Layer 1s (Avalanche, Fantom, Cronos, etc.)
			- EVM-compatible chains (most networks support Ethereum Virtual Machine)
			- Non-EVM chains (Solana, Near, Aptos, Sui, etc.)

			IMPORTANT MATCHING RULES:
			1. Match the user input to the most appropriate chain from the available list below
			2. Handle common variations, abbreviations, and naming conventions:

			   MAJOR NETWORKS:
			   - "BSC", "BNB", "Binance", "Binance Smart Chain" → "BNB Chain" (ID: bsc)
			   - "ETH", "Ethereum Mainnet", "Ethereum Network" → "Ethereum" (ID: eth)
			   - "Polygon", "MATIC", "Polygon Network" → "Polygon" (ID: matic)
			   - "ARB", "Arbitrum One", "Arbitrum Network" → "Arbitrum" (ID: arb)
			   - "OP", "Optimism Mainnet", "Optimism Network" → "Optimism" (ID: op)

			   LAYER 2s:
			   - "Base", "Base Network", "Coinbase Base" → "Base" (ID: base)
			   - "zkSync", "zkSync Era" → "zkSync Era" (ID: era)
			   - "Linea", "Linea Network" → "Linea" (ID: linea)
			   - "Scroll", "Scroll Network" → "Scroll" (ID: scrl)

			   ALT L1s:
			   - "AVAX", "Avalanche C-Chain", "Avalanche Network" → "Avalanche" (ID: avax)
			   - "FTM", "Fantom Network", "Fantom Opera" → "Fantom" (ID: ftm)
			   - "SOL", "Solana Network", "Solana Mainnet" → "Solana" (ID: sol)
			   - "CRO", "Cronos Network", "Cronos Chain" → "Cronos" (ID: cro)

			   SPECIALIZED:
			   - "Aurora", "Aurora Network" → "Aurora" (ID: aurora)
			   - "Moonbeam", "Moonbeam Network" → "Moonbeam" (ID: mobm)
			   - "Moonriver", "Moonriver Network" → "Moonriver" (ID: movr)

			3. Return ONLY the chain ID (the lowercase identifier after the colon in the chain list)
			4. If no match is found, return exactly this token: __NOT_FOUND__
			5. Be flexible with naming variations but prioritize exact matches when available
			6. Handle case-insensitive matching for all inputs
			7. Consider common abbreviations, ticker symbols, and network naming conventions
			8. Some networks have multiple valid names (use any to match)

			OUTPUT FORMAT:
			- Success: Return just the chain ID (e.g., "eth", "bsc", "matic")
			- Failure: Return exactly "__NOT_FOUND__" (no quotes, just the token)
			- Never return explanations, just the chain ID or __NOT_FOUND__

			Available DeBank Chains (format: Chain Name: chain_id):
		`;

		// Create cached content with the chain list and system instruction
		const { name } = await cacheManager.create({
			model: gemini25Flash,
			systemInstruction,
			contents: [
				{
					role: "user",
					parts: [
						{
							text: chainList,
						},
					],
				},
			],
			ttlSeconds: 3600, // 1 hour cache
		});

		cachedContentName = name ?? null;
		logger.info(
			`Gemini context cache initialized successfully (cache: ${cachedContentName})`,
		);
	} catch (error) {
		logger.error("Failed to initialize Gemini cache manager:", error);
		cacheManager = null;
		cachedContentName = null;
	}
}

// Initialize cache on module load
initializeCacheManager().catch((error) => {
	logger.error("Error during cache initialization:", error);
});

const isNotFoundResponse = (output: string): boolean => {
	return output.toUpperCase().includes(NOT_FOUND_TOKEN);
};

const sanitizeChainId = (output: string): string => {
	return output.toLowerCase().replace(/[^a-z0-9_-]/g, "");
};

/**
 * Determines if a value needs resolution based on its format
 * DeBank chain IDs are lowercase short codes (eth, bsc, matic)
 * If value contains uppercase letters or spaces, it needs resolution
 */
export function needsResolution(
	value: string | undefined,
	type: "chain" | "token",
): boolean {
	if (!value) return false;
	const str = String(value);

	if (type === "chain") {
		// DeBank chain IDs are lowercase without spaces (eth, bsc, matic, arb)
		// If we see uppercase letters or spaces, it needs resolution
		return /[A-Z\s]/.test(str);
	}

	if (type === "token") {
		// Token addresses are contract addresses (0x...) or native IDs If it's already a contract address (starts with 0x, 42 chars), no resolution needed
		if (str.startsWith("0x") && str.length === 42) {
			return false;
		}

		// If it contains keywords for wrapped tokens or native tokens, needs resolution
		const wrappedTokenKeywords = [
			"weth",
			"wbnb",
			"wmatic",
			"wavax",
			"wrapped",
			"native",
		];

		const lowerStr = str.toLowerCase();
		return wrappedTokenKeywords.some((keyword) => lowerStr.includes(keyword));
	}

	return false;
}

/**
 * Resolves a human-friendly chain name to DeBank chain ID using Gemini AI
 * @param name - Chain name (e.g., "Ethereum", "BSC", "Binance Smart Chain")
 * @returns DeBank chain ID (e.g., "eth", "bsc") or null if not found
 */
export async function resolveChain(name: string): Promise<string | null> {
	try {
		// Use cached content if available, otherwise fall back to inline prompt
		const result = cachedContentName
			? await generateText({
					model: google(gemini25Flash),
					prompt: `User input: "${name}"\n\nYour response (chain ID only, or "__NOT_FOUND__" if no match):`,
					providerOptions: {
						google: {
							cachedContent: cachedContentName,
						},
					},
				})
			: await generateText({
					model: google(gemini25Flash),
					prompt: endent`
						You are a blockchain chain resolver. Given a user's input for a blockchain name, find the matching DeBank chain ID.

						Available chains (format: Name: id):
						${chainIds.map((chain) => `${chain.name}: ${chain.id}`).join("\n")}

						User input: "${name}"

						Rules:
						1. Match the user input to the most appropriate chain from the list
						2. Handle common variations and abbreviations (e.g., "BSC" = "BNB Chain", "Polygon" = "Polygon", "ETH" = "Ethereum")
						3. Return ONLY the chain ID (the part after the colon), nothing else
						4. If no match is found, return the exact token "__NOT_FOUND__"

						Examples:
						- Input: "Ethereum" → Output: eth
						- Input: "BSC" → Output: bsc
						- Input: "Binance Smart Chain" → Output: bsc
						- Input: "Polygon" → Output: matic
						- Input: "Arbitrum" → Output: arb
						- Input: "Made Up Chain" → Output: __NOT_FOUND__

						Your response (chain ID only, or "__NOT_FOUND__" if no match):
					`,
				});

		const rawOutput = result.text.trim();
		if (isNotFoundResponse(rawOutput)) {
			logger.warn(`Could not resolve chain: ${name}`);
			return null;
		}

		const sanitized = sanitizeChainId(rawOutput);

		// Validate that the resolved ID exists in our chain list
		const chainExists = chainIds.some((chain) => chain.id === sanitized);

		if (!chainExists || sanitized.length === 0) {
			logger.warn(`Could not resolve chain: ${name}`);
			return null;
		}

		logger.info(`Resolved chain "${name}" → "${sanitized}"`);
		return sanitized;
	} catch (error) {
		logger.error(`Error resolving chain ${name}:`, error);
		return null;
	}
}

/**
 * Resolves comma-separated chain names to comma-separated chain IDs
 * @param commaSeparated - Comma-separated chain names (e.g., "Ethereum, BSC, Polygon")
 * @returns Comma-separated chain IDs (e.g., "eth,bsc,matic") or null if any resolution fails
 */
export async function resolveChains(
	commaSeparated: string,
): Promise<string | null> {
	try {
		// Split by comma, trim whitespace
		const names = commaSeparated.split(",").map((name) => name.trim());

		// Resolve each chain
		const resolvedPromises = names.map((name) => {
			// Skip if already in correct format (lowercase, no spaces)
			if (!needsResolution(name, "chain")) {
				return Promise.resolve(name);
			}
			return resolveChain(name);
		});

		const resolved = await Promise.all(resolvedPromises);

		// Check if any resolution failed
		if (resolved.some((id) => id === null)) {
			logger.warn(`Failed to resolve some chains in: ${commaSeparated}`);
			return null;
		}

		const result = resolved.join(",");
		logger.info(`Resolved chains "${commaSeparated}" → "${result}"`);
		return result;
	} catch (error) {
		logger.error(
			`Error resolving comma-separated chains ${commaSeparated}:`,
			error,
		);
		return null;
	}
}

/**
 * Resolves wrapped token keywords to the chain's wrapped token contract address
 * @param tokenKeyword - Token keyword (e.g., "WETH", "wrapped native", "native token")
 * @param chainId - Resolved chain ID (e.g., "eth", "bsc", "matic")
 * @returns Wrapped token contract address or null if not found
 */
export function resolveWrappedToken(
	tokenKeyword: string,
	chainId: string,
): string | null {
	try {
		// Find the chain in our enum
		const chain = chainIds.find((c) => c.id === chainId);

		if (!chain) {
			logger.warn(`Chain not found for ID: ${chainId}`);
			return null;
		}

		// Check if chain has a wrapped token
		if (!chain.wrappedTokenId || chain.wrappedTokenId.trim() === "") {
			logger.warn(
				`Chain ${chainId} (${chain.name}) does not have a wrapped token address`,
			);
			return null;
		}

		logger.info(
			`Resolved wrapped token "${tokenKeyword}" on ${chain.name} → "${chain.wrappedTokenId}"`,
		);
		return chain.wrappedTokenId;
	} catch (error) {
		logger.error(
			`Error resolving wrapped token ${tokenKeyword} on chain ${chainId}:`,
			error,
		);
		return null;
	}
}

/**
 * Auto-resolves all entity parameters in an args object
 * Modifies args in-place
 * @param args - Arguments object with potential entity parameters
 */
export async function resolveEntities(
	args: Record<string, unknown>,
): Promise<void> {
	// Step 1: Handle single chain_id parameter (must resolve first for token resolution)
	if (
		args.chain_id &&
		typeof args.chain_id === "string" &&
		needsResolution(args.chain_id, "chain")
	) {
		const resolved = await resolveChain(args.chain_id);
		if (resolved) {
			args.chain_id = resolved;
		}
	}

	// Step 2: Handle comma-separated chain_ids parameter
	if (
		args.chain_ids &&
		typeof args.chain_ids === "string" &&
		needsResolution(args.chain_ids, "chain")
	) {
		const resolved = await resolveChains(args.chain_ids);
		if (resolved) {
			args.chain_ids = resolved;
		}
	}

	// Step 3: Handle token_id parameter (wrapped token resolution)
	// Only resolve if chain_id is present and token_id contains wrapped token keywords
	if (
		args.token_id &&
		typeof args.token_id === "string" &&
		args.chain_id &&
		typeof args.chain_id === "string" &&
		needsResolution(args.token_id, "token")
	) {
		const resolved = resolveWrappedToken(args.token_id, args.chain_id);
		if (resolved) {
			args.token_id = resolved;
		}
	}

	// Step 4: Handle 'id' parameter for token context ONLY
	// Only resolve if:
	// 1. Has chain_id parameter (indicates token context, not protocol/pool/wallet)
	// 2. 'id' contains wrapped token keywords
	// 3. 'id' is not already a contract address
	if (
		args.id &&
		typeof args.id === "string" &&
		args.chain_id &&
		typeof args.chain_id === "string" &&
		needsResolution(args.id, "token")
	) {
		const resolved = resolveWrappedToken(args.id, args.chain_id);
		if (resolved) {
			args.id = resolved;
		}
	}

	// NOTE: We do NOT resolve 'id' parameter for non-token contexts:
	// - debank_get_chain: id = chain ID (handled explicitly in tool's execute function)
	// - debank_get_protocol_information: id = protocol ID (should NOT resolve)
	// - debank_get_pool_information: id = pool contract address (should NOT resolve)
	// - debank_get_user_*: id = wallet address (should NOT resolve)
}
