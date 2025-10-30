/**
 * Universal Entity Resolver for DefiLlama
 *
 * Automatically resolves human-friendly names to API-compatible IDs/slugs:
 * - Protocols: "Uniswap" → "uniswap"
 * - Chains: "BSC" → "BSC", "Binance Smart Chain" → "BSC"
 * - Stablecoins: "USDC" → "2", "Tether" → "1"
 * - Bridges: "Polygon Bridge" → 1
 * - Options: "Aevo" → "aevo"
 */

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { GoogleAICacheManager } from "@google/generative-ai/server";
import { generateText } from "ai";
import endent from "endent";
import { env } from "../../env";
import { logger } from "../../lib/utils";
import { bridgeIds } from "./enums/bridgeIds";
import { chains } from "./enums/chains";
import { options } from "./enums/options";
import { protocols } from "./enums/protocols";
import { stablecoins } from "./enums/stablecoinIds";

const google = createGoogleGenerativeAI({
	apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const gemini25Flash = "gemini-2.5-flash";
const NOT_FOUND_TOKEN = "__NOT_FOUND__";

// Cache manager and cached content names for each entity type
let cacheManager: GoogleAICacheManager | null = null;
let protocolsCacheName: string | null = null;
let chainsCacheName: string | null = null;
let stablecoinsCacheName: string | null = null;
let bridgesCacheName: string | null = null;

/**
 * Initialize cache manager and create cached content for all entity types
 * This dramatically reduces token usage and improves performance
 */
async function initializeCacheManager(): Promise<void> {
	if (!env.GOOGLE_GENERATIVE_AI_API_KEY) {
		logger.warn(
			"GOOGLE_GENERATIVE_AI_API_KEY not found, caching will be disabled",
		);
		return;
	}

	try {
		cacheManager = new GoogleAICacheManager(env.GOOGLE_GENERATIVE_AI_API_KEY);

		// Cache protocols (largest dataset - 39K+ lines)
		const protocolsContext = protocols
			.map((p) => `${p.slug}|${p.name}|${p.symbol}`)
			.join("\n");

		const protocolsInstruction = endent`
			You are a protocol slug matcher for DefiLlama API.
			Your task is to match user-provided protocol names to their corresponding slugs.

			DefiLlama tracks 2,000+ DeFi protocols across all chains. Protocols include:
			- DEXs (Uniswap, Curve, PancakeSwap, etc.)
			- Lending protocols (Aave, Compound, MakerDAO, etc.)
			- Liquid staking (Lido, Rocket Pool, etc.)
			- Derivatives (GMX, dYdX, etc.)
			- Yield aggregators (Yearn, Beefy, etc.)

			MATCHING RULES:
			1. Return ONLY the slug from the provided list
			2. Match by name, symbol, or slug (case-insensitive)
			3. For protocols with versions (v2, v3), prefer latest unless specified
			4. Handle variations: "Uniswap" → "uniswap", "Aave V3" → "aave-v3"
			5. If no match found, return exactly: __NOT_FOUND__

			AVAILABLE PROTOCOLS (format: slug|name|symbol):
		`;

		const { name: protocolsCache } = await cacheManager.create({
			model: gemini25Flash,
			systemInstruction: protocolsInstruction,
			contents: [
				{
					role: "user",
					parts: [{ text: protocolsContext }],
				},
			],
			ttlSeconds: 3600,
		});

		protocolsCacheName = protocolsCache ?? null;
		logger.info(`Protocols cache initialized (${protocolsCacheName})`);

		// Cache chains
		const chainsContext = chains
			.map((c) => `${c.name}|${c.tokenSymbol || ""}|${c.gecko_id || ""}`)
			.join("\n");

		const chainsInstruction = endent`
			You are a blockchain name matcher for DefiLlama API.
			Your task is to match user-provided chain names to their canonical names.

			DefiLlama tracks 100+ blockchain networks including:
			- Layer 1s (Ethereum, BSC, Solana, etc.)
			- Layer 2s (Arbitrum, Optimism, Base, etc.)
			- Sidechains and alt-L1s

			MATCHING RULES:
			1. Return ONLY the exact chain name from the list
			2. Handle abbreviations: "BSC" → "BSC", "ETH" → "Ethereum"
			3. Match by name, token symbol, or CoinGecko ID
			4. If no match found, return exactly: __NOT_FOUND__

			AVAILABLE CHAINS (format: name|tokenSymbol|gecko_id):
		`;

		const { name: chainsCache } = await cacheManager.create({
			model: gemini25Flash,
			systemInstruction: chainsInstruction,
			contents: [
				{
					role: "user",
					parts: [{ text: chainsContext }],
				},
			],
			ttlSeconds: 3600,
		});

		chainsCacheName = chainsCache ?? null;
		logger.info(`Chains cache initialized (${chainsCacheName})`);

		// Cache stablecoins
		const stablecoinsContext = stablecoins
			.map((s) => `${s.id}|${s.name}|${s.symbol}`)
			.join("\n");

		const stablecoinsInstruction = endent`
			You are a stablecoin ID matcher for DefiLlama API.
			Your task is to match user-provided stablecoin names to their numeric IDs.

			Common stablecoins:
			- USDT (Tether) - ID: 1
			- USDC (USD Coin) - ID: 2
			- DAI - ID: 5
			- BUSD - ID: 3

			MATCHING RULES:
			1. Return ONLY the numeric ID
			2. Match by name or symbol (case-insensitive)
			3. If no match found, return exactly: __NOT_FOUND__

			AVAILABLE STABLECOINS (format: id|name|symbol):
		`;

		const { name: stablecoinsCache } = await cacheManager.create({
			model: gemini25Flash,
			systemInstruction: stablecoinsInstruction,
			contents: [
				{
					role: "user",
					parts: [{ text: stablecoinsContext }],
				},
			],
			ttlSeconds: 3600,
		});

		stablecoinsCacheName = stablecoinsCache ?? null;
		logger.info(`Stablecoins cache initialized (${stablecoinsCacheName})`);

		// Cache bridges
		const bridgesContext = bridgeIds
			.map((b) => `${b.id}|${b.name}|${b.displayName}`)
			.join("\n");

		const bridgesInstruction = endent`
			You are a bridge ID matcher for DefiLlama API.
			Your task is to match user-provided bridge names to their numeric IDs.

			DefiLlama tracks bridge volume and Total Value Locked (TVL) metrics across major cross-chain bridges.
			Bridges facilitate asset transfers between different blockchain networks and are critical infrastructure
			for the multi-chain DeFi ecosystem.

			BRIDGE CATEGORIES:
			1. Official Chain Bridges - Native bridges operated by blockchain projects
			   - Polygon Bridge (PoS Bridge) - ID: 1
			   - Arbitrum Bridge (Official) - ID: 2
			   - Optimism Bridge (Gateway) - ID: 4
			   - Base Bridge (Coinbase L2) - ID: varies
			   - zkSync Bridge - ID: varies

			2. Third-Party Multi-Chain Bridges - Protocol-operated bridges
			   - Stargate Finance (LayerZero-based) - ID: 12
			   - Synapse Protocol (cross-chain AMM) - ID: varies
			   - Hop Protocol (rollup bridge) - ID: varies
			   - Multichain (formerly Anyswap) - ID: varies
			   - Celer cBridge - ID: varies

			3. Specialized Bridges - Advanced bridging solutions
			   - Wormhole (cross-chain messaging) - ID: varies
			   - Axelar Network - ID: varies
			   - LayerZero (messaging protocol) - ID: varies

			MATCHING RULES:
			1. Return ONLY the numeric ID from the provided list below
			2. Match by name or display name (case-insensitive)
			3. Handle common variations and abbreviations:
			   - "Polygon Bridge", "Polygon PoS Bridge", "Polygon" → match to polygon bridge
			   - "Arbitrum Bridge", "Arbitrum", "ARB Bridge" → match to arbitrum bridge
			   - "Stargate Finance", "Stargate", "STG Bridge" → match to stargate
			   - "Optimism Bridge", "Optimism", "OP Bridge" → match to optimism bridge
			4. If no match found, return exactly: __NOT_FOUND__
			5. Be flexible with naming:
			   - With/without "Bridge" suffix
			   - With/without protocol type (e.g., "PoS", "Official")
			   - Common abbreviations (BSC, ARB, OP, etc.)

			EXAMPLES OF MATCHING:
			- User: "Polygon Bridge" → 1 (official Polygon PoS bridge)
			- User: "Polygon PoS Bridge" → 1 (same bridge, full name)
			- User: "Arbitrum" → 2 (official Arbitrum bridge)
			- User: "Arbitrum Bridge" → 2 (same bridge with explicit "Bridge")
			- User: "Stargate Finance" → 12 (Stargate cross-chain bridge)
			- User: "Stargate" → 12 (abbreviated name)
			- User: "STG Bridge" → 12 (ticker symbol variant)
			- User: "Optimism Bridge" → 4 (official Optimism gateway)
			- User: "OP Bridge" → 4 (abbreviated chain name)
			- User: "Synapse Protocol" → (find matching ID in list)
			- User: "Hop Protocol" → (find matching ID in list)
			- User: "Fictional Bridge XYZ" → __NOT_FOUND__ (not in list)

			OUTPUT FORMAT:
			- Success: Return just the numeric ID as a string (e.g., "1", "2", "12", "4")
			- Failure: Return exactly "__NOT_FOUND__" (no quotes in output)
			- Never include explanations, descriptions, or additional text
			- Never include the bridge name in output, only the ID or __NOT_FOUND__

			IMPORTANT NOTES:
			- Always check the provided bridge list below for exact ID matches
			- Prioritize exact name matches over partial matches
			- If multiple bridges could match, choose the most commonly used one
			- Bridge IDs are unique numeric identifiers used by the DefiLlama API

			AVAILABLE BRIDGES (format: id|name|displayName):
		`;

		const { name: bridgesCache } = await cacheManager.create({
			model: gemini25Flash,
			systemInstruction: bridgesInstruction,
			contents: [
				{
					role: "user",
					parts: [{ text: bridgesContext }],
				},
			],
			ttlSeconds: 3600,
		});

		bridgesCacheName = bridgesCache ?? null;
		logger.info(`Bridges cache initialized (${bridgesCacheName})`);

		logger.info("✅ All DefiLlama entity caches initialized successfully");
	} catch (error) {
		logger.error("Failed to initialize DefiLlama cache manager:", error);
		cacheManager = null;
		protocolsCacheName = null;
		chainsCacheName = null;
		stablecoinsCacheName = null;
		bridgesCacheName = null;
	}
}

// Initialize caches on module load
initializeCacheManager().catch((error) => {
	logger.error("Error during cache initialization:", error);
});

const isNotFoundResponse = (output: string): boolean => {
	return output.toUpperCase().includes(NOT_FOUND_TOKEN);
};

const stripDecorations = (output: string): string => {
	return output
		.trim()
		.replace(/^[`"'“”‘’]+/, "")
		.replace(/[`"'“”‘’]+$/, "")
		.replace(/[.!?]+$/, "")
		.trim();
};

const sanitizeSlug = (output: string): string => {
	return stripDecorations(output)
		.toLowerCase()
		.replace(/[^a-z0-9_-]/g, "");
};

const sanitizeChainName = (output: string): string => {
	return stripDecorations(output);
};

const sanitizeNumericString = (output: string): string => {
	return stripDecorations(output).replace(/[^0-9]/g, "");
};

/**
 * Detect if a value needs resolution based on its format
 */
export function needsResolution(
	value: string | number | undefined,
	type: "protocol" | "chain" | "stablecoin" | "bridge" | "option",
): boolean {
	if (!value) return false;

	const str = String(value);

	// For stablecoins, if it's not a pure number, resolve it
	if (type === "stablecoin") {
		return Number.isNaN(Number(str)) || /[A-Za-z]/.test(str);
	}

	// For bridges, if it's not a pure number, resolve it
	if (type === "bridge") {
		return Number.isNaN(Number(str)) || /[A-Za-z]/.test(str);
	}

	// For protocols, chains, and options:
	// If it has uppercase letters, spaces, or special chars, it likely needs resolution Slugs are typically lowercase with hyphens only
	return /[A-Z\s]/.test(str);
}

/**
 * Resolve a protocol name to its slug using Gemini AI with caching
 */
export async function resolveProtocol(name: string): Promise<string | null> {
	try {
		// Use cached content if available, otherwise fallback to inline prompt
		const result = protocolsCacheName
			? await generateText({
					model: google(gemini25Flash),
					prompt: `USER QUERY: "${name}"\n\nReturn ONLY the slug or __NOT_FOUND__:`,
					providerOptions: {
						google: {
							cachedContent: protocolsCacheName,
						},
					},
				})
			: await generateText({
					model: google(gemini25Flash),
					prompt: endent`
						You are a protocol slug matcher for DefiLlama API.

						AVAILABLE PROTOCOLS (format: slug|name|symbol):
						${protocols.map((p) => `${p.slug}|${p.name}|${p.symbol}`).join("\n")}

						USER QUERY: "${name}"

						Your task: Find the EXACT protocol slug that best matches the user's query.

						Rules:
						1. Return ONLY the slug, nothing else
						2. Match the user's query to the most appropriate protocol from the list
						3. For protocols with multiple versions, prefer the latest/most commonly used version unless the user explicitly specifies a version
						4. If no good match exists, return the exact token "__NOT_FOUND__"
						5. Be case-insensitive and flexible with spacing and punctuation

						Examples:
						- User: "Lido" → "lido"
						- User: "Aave V3" → "aave-v3"
						- User: "Curve" → "curve-dex"
						- User: "MakerDAO" → "makerdao"
						- User: "Unknown Protocol" → "__NOT_FOUND__"

						Now find the slug for the user query above:
					`,
					system: endent`
						You are a precise protocol matcher. Return ONLY the slug or __NOT_FOUND__. No explanations.
					`,
				});

		const rawOutput = result.text.trim();
		if (isNotFoundResponse(rawOutput)) {
			logger.warn(`Could not resolve protocol: ${name}`);
			return null;
		}

		const slug = sanitizeSlug(rawOutput);

		if (!slug) {
			logger.warn(`Gemini returned empty protocol slug for: ${name}`);
			return null;
		}

		// Validate that the returned slug exists
		const exists = protocols.some((p) => p.slug.toLowerCase() === slug);
		if (exists) {
			logger.info(`Resolved protocol "${name}" → "${slug}"`);
			return slug;
		}

		logger.warn(`Gemini returned invalid protocol slug: ${slug}`);
		return null;
	} catch (error) {
		logger.error("Error resolving protocol:", error);
		return null;
	}
}

/**
 * Resolve a chain name to its canonical name using Gemini AI with caching
 */
export async function resolveChain(name: string): Promise<string | null> {
	try {
		// Use cached content if available, otherwise fallback to inline prompt
		const result = chainsCacheName
			? await generateText({
					model: google(gemini25Flash),
					prompt: `USER QUERY: "${name}"\n\nReturn ONLY the exact chain name or __NOT_FOUND__:`,
					providerOptions: {
						google: {
							cachedContent: chainsCacheName,
						},
					},
				})
			: await generateText({
					model: google(gemini25Flash),
					prompt: endent`
						You are a blockchain name matcher for DefiLlama API.

						AVAILABLE CHAINS (format: name|tokenSymbol|gecko_id):
						${chains.map((c) => `${c.name}|${c.tokenSymbol || ""}|${c.gecko_id || ""}`).join("\n")}

						USER QUERY: "${name}"

						Your task: Find the EXACT chain name that best matches the user's query.

						Rules:
						1. Return ONLY the exact chain name as it appears in the list, nothing else
						2. Match the user's query to the most appropriate chain
						3. Handle variations: "BSC" = "Binance Smart Chain", "ETH" = "Ethereum", "Matic" = "Polygon"
						4. If no good match exists, return the exact token "__NOT_FOUND__"
						5. Be case-sensitive for the output - return the exact name from the list

						Examples:
						- User: "Ethereum" → "Ethereum"
						- User: "BSC" → "BSC"
						- User: "Binance Smart Chain" → "BSC"
						- User: "Polygon" → "Polygon"
						- User: "Matic" → "Polygon"
						- User: "Unknown Chain" → "__NOT_FOUND__"

						Now find the chain name for the user query above:
					`,
					system: endent`
						You are a precise chain matcher. Return ONLY the exact chain name or __NOT_FOUND__. No explanations.
					`,
				});

		const rawOutput = result.text.trim();
		if (isNotFoundResponse(rawOutput)) {
			logger.warn(`Could not resolve chain: ${name}`);
			return null;
		}

		const chainName = sanitizeChainName(rawOutput);

		if (!chainName) {
			logger.warn(`Gemini returned empty chain name for: ${name}`);
			return null;
		}

		// Validate that the returned chain exists
		const exists = chains.some((c) => c.name === chainName);
		if (exists) {
			logger.info(`Resolved chain "${name}" → "${chainName}"`);
			return chainName;
		}

		logger.warn(`Gemini returned invalid chain name: ${chainName}`);
		return null;
	} catch (error) {
		logger.error("Error resolving chain:", error);
		return null;
	}
}

/**
 * Resolve a stablecoin name/symbol to its ID using Gemini AI with caching
 */
export async function resolveStablecoin(name: string): Promise<string | null> {
	try {
		// Use cached content if available, otherwise fallback to inline prompt
		const result = stablecoinsCacheName
			? await generateText({
					model: google(gemini25Flash),
					prompt: `USER QUERY: "${name}"\n\nReturn ONLY the numeric ID or __NOT_FOUND__:`,
					providerOptions: {
						google: {
							cachedContent: stablecoinsCacheName,
						},
					},
				})
			: await generateText({
					model: google(gemini25Flash),
					prompt: endent`
						You are a stablecoin ID matcher for DefiLlama API.

						AVAILABLE STABLECOINS (format: id|name|symbol):
						${stablecoins.map((s) => `${s.id}|${s.name}|${s.symbol}`).join("\n")}

						USER QUERY: "${name}"

						Your task: Find the EXACT stablecoin ID that best matches the user's query.

						Rules:
						1. Return ONLY the numeric ID, nothing else
						2. Match the user's query to the most appropriate stablecoin by name or symbol
						3. Handle variations: "USDC" = "USD Coin" (ID: 2), "Tether" = "USDT" (ID: 1)
						4. If no good match exists, return the exact token "__NOT_FOUND__"

						Examples:
						- User: "USDC" → "2"
						- User: "USD Coin" → "2"
						- User: "Tether" → "1"
						- User: "USDT" → "1"
						- User: "DAI" → "5"
						- User: "Unknown Stablecoin" → "__NOT_FOUND__"

						Now find the ID for the user query above:
					`,
					system: endent`
						You are a precise stablecoin matcher. Return ONLY the numeric ID or __NOT_FOUND__. No explanations.
					`,
				});

		const rawOutput = result.text.trim();

		if (isNotFoundResponse(rawOutput)) {
			logger.warn(`Could not resolve stablecoin: ${name}`);
			return null;
		}

		const id = sanitizeNumericString(rawOutput);
		if (!id) {
			logger.warn(`Gemini returned invalid stablecoin ID: ${rawOutput}`);
			return null;
		}

		// Validate that the returned ID exists
		const exists = stablecoins.some((s) => s.id === id);
		if (exists) {
			logger.info(`Resolved stablecoin "${name}" → ID ${id}`);
			return id;
		}

		logger.warn(`Gemini returned invalid stablecoin ID: ${id}`);
		return null;
	} catch (error) {
		logger.error("Error resolving stablecoin:", error);
		return null;
	}
}

/**
 * Resolve a bridge name to its ID using Gemini AI with caching
 */
export async function resolveBridge(name: string): Promise<number | null> {
	try {
		// Use cached content if available, otherwise fallback to inline prompt
		const result = bridgesCacheName
			? await generateText({
					model: google(gemini25Flash),
					prompt: `USER QUERY: "${name}"\n\nReturn ONLY the numeric ID or __NOT_FOUND__:`,
					providerOptions: {
						google: {
							cachedContent: bridgesCacheName,
						},
					},
				})
			: await generateText({
					model: google(gemini25Flash),
					prompt: endent`
						You are a bridge ID matcher for DefiLlama API.

						AVAILABLE BRIDGES (format: id|name|displayName):
						${bridgeIds.map((b) => `${b.id}|${b.name}|${b.displayName}`).join("\n")}

						USER QUERY: "${name}"

						Your task: Find the EXACT bridge ID that best matches the user's query.

						Rules:
						1. Return ONLY the numeric ID, nothing else
						2. Match the user's query to the most appropriate bridge by name or display name
						3. Handle variations in naming
						4. If no good match exists, return the exact token "__NOT_FOUND__"

						Examples:
						- User: "Polygon Bridge" → "1"
						- User: "Stargate" → "12"
						- User: "Arbitrum" → "2"
						- User: "Fictional Bridge" → "__NOT_FOUND__"

						Now find the ID for the user query above:
					`,
					system: endent`
						You are a precise bridge matcher. Return ONLY the numeric ID or __NOT_FOUND__. No explanations.
					`,
				});

		const rawOutput = result.text.trim();

		if (isNotFoundResponse(rawOutput)) {
			logger.warn(`Could not resolve bridge: ${name}`);
			return null;
		}

		const idStr = sanitizeNumericString(rawOutput);
		if (!idStr) {
			logger.warn(`Gemini returned invalid bridge ID: ${rawOutput}`);
			return null;
		}

		const id = Number(idStr);
		if (Number.isNaN(id)) {
			logger.warn(`Gemini returned non-numeric bridge ID: ${idStr}`);
			return null;
		}

		// Validate that the returned ID exists
		const exists = bridgeIds.some((b) => b.id === id);
		if (exists) {
			logger.info(`Resolved bridge "${name}" → ID ${id}`);
			return id;
		}

		logger.warn(`Gemini returned invalid bridge ID: ${id}`);
		return null;
	} catch (error) {
		logger.error("Error resolving bridge:", error);
		return null;
	}
}

/**
 * Resolve an options protocol name to its slug
 * Since there are only 15 options, we can use simple string matching
 */
export async function resolveOption(name: string): Promise<string | null> {
	try {
		// Try exact match first (case-insensitive)
		const exactMatch = options.find(
			(o) =>
				o.name.toLowerCase() === name.toLowerCase() ||
				o.slug.toLowerCase() === name.toLowerCase(),
		);

		if (exactMatch) {
			logger.info(`Resolved option "${name}" → "${exactMatch.slug}"`);
			return exactMatch.slug;
		}

		// Try partial match
		const partialMatch = options.find(
			(o) =>
				o.name.toLowerCase().includes(name.toLowerCase()) ||
				name.toLowerCase().includes(o.name.toLowerCase()),
		);

		if (partialMatch) {
			logger.info(
				`Resolved option "${name}" → "${partialMatch.slug}" (partial match)`,
			);
			return partialMatch.slug;
		}

		logger.warn(`Could not resolve option: ${name}`);
		return null;
	} catch (error) {
		logger.error("Error resolving option:", error);
		return null;
	}
}

/**
 * Batch resolve multiple entities in parallel
 */
export async function resolveEntities(request: {
	protocols?: string[];
	chains?: string[];
	stablecoins?: string[];
	bridges?: string[];
	options?: string[];
}): Promise<{
	protocols: Record<string, string | null>;
	chains: Record<string, string | null>;
	stablecoins: Record<string, string | null>;
	bridges: Record<string, number | null>;
	options: Record<string, string | null>;
}> {
	const results: {
		protocols: Record<string, string | null>;
		chains: Record<string, string | null>;
		stablecoins: Record<string, string | null>;
		bridges: Record<string, number | null>;
		options: Record<string, string | null>;
	} = {
		protocols: {},
		chains: {},
		stablecoins: {},
		bridges: {},
		options: {},
	};

	// Process all resolutions in parallel
	const promises: Promise<void>[] = [];

	if (request.protocols) {
		for (const protocol of request.protocols) {
			promises.push(
				(async () => {
					results.protocols[protocol] = await resolveProtocol(protocol);
				})(),
			);
		}
	}

	if (request.chains) {
		for (const chain of request.chains) {
			promises.push(
				(async () => {
					results.chains[chain] = await resolveChain(chain);
				})(),
			);
		}
	}

	if (request.stablecoins) {
		for (const stablecoin of request.stablecoins) {
			promises.push(
				(async () => {
					results.stablecoins[stablecoin] = await resolveStablecoin(stablecoin);
				})(),
			);
		}
	}

	if (request.bridges) {
		for (const bridge of request.bridges) {
			promises.push(
				(async () => {
					results.bridges[bridge] = await resolveBridge(bridge);
				})(),
			);
		}
	}

	if (request.options) {
		for (const option of request.options) {
			promises.push(
				(async () => {
					results.options[option] = await resolveOption(option);
				})(),
			);
		}
	}

	await Promise.all(promises);

	return results;
}
