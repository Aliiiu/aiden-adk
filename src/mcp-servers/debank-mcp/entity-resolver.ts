import { generateText } from "ai";
import endent from "endent";
import { createChildLogger } from "../../lib/utils";
import { chainIds } from "./enums/chains";

const logger = createChildLogger("DeBank Entity Resolver");
const gemini25Flash = "gemini-2.5-flash";
const NOT_FOUND_TOKEN = "__NOT_FOUND__";

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
		// Prepare chain list for AI context
		const chainList = chainIds
			.map((chain) => `${chain.name}: ${chain.id}`)
			.join("\n");

		const prompt = endent`
			You are a blockchain chain resolver. Given a user's input for a blockchain name, find the matching DeBank chain ID.

			Available chains (format: Name: id):
			${chainList}

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
		`;

		const result = await generateText({
			model: gemini25Flash,
			prompt,
			providerOptions: {
				google: {
					cacheControl: true,
					// Cache the chain list since it rarely changes
					cachedContent: {
						content: chainList,
						ttlSeconds: 3600, // 1 hour
					},
				},
			},
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
