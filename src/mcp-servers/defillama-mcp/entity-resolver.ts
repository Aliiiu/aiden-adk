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
 * Resolve a protocol name to its slug using Gemini AI
 */
export async function resolveProtocol(name: string): Promise<string | null> {
	try {
		const protocolsContext = protocols
			.map((p) => `${p.slug}|${p.name}|${p.symbol}`)
			.join("\n");

		const prompt = endent`
			You are a protocol slug matcher for DefiLlama API.

			AVAILABLE PROTOCOLS (format: slug|name|symbol):
			${protocolsContext}

			USER QUERY: "${name}"

			Your task: Find the EXACT protocol slug that best matches the user's query.

			Rules:
			1. Return ONLY the slug, nothing else
			2. Match the user's query to the most appropriate protocol from the list
			3. For protocols with multiple versions, prefer the latest/most commonly used version unless the user explicitly specifies a version
			4. If no good match exists, return "NOT_FOUND"
			5. Be case-insensitive and flexible with spacing and punctuation

			Examples:
			- User: "Lido" → "lido"
			- User: "Aave V3" → "aave-v3"
			- User: "Curve" → "curve-dex"
			- User: "MakerDAO" → "makerdao"

			Now find the slug for the user query above:
		`;

		const result = await generateText({
			model: google(gemini25Flash),
			prompt,
			system: endent`
				You are a precise protocol matcher. Return ONLY the slug or NOT_FOUND. No explanations.
			`,
		});

		const slug = result.text.trim().toLowerCase();

		if (slug === "not_found") {
			logger.warn(`Could not resolve protocol: ${name}`);
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
 * Resolve a chain name to its canonical name using Gemini AI
 */
export async function resolveChain(name: string): Promise<string | null> {
	try {
		const chainsContext = chains
			.map((c) => `${c.name}|${c.tokenSymbol || ""}|${c.gecko_id || ""}`)
			.join("\n");

		const prompt = endent`
			You are a blockchain name matcher for DefiLlama API.

			AVAILABLE CHAINS (format: name|tokenSymbol|gecko_id):
			${chainsContext}

			USER QUERY: "${name}"

			Your task: Find the EXACT chain name that best matches the user's query.

			Rules:
			1. Return ONLY the exact chain name as it appears in the list, nothing else
			2. Match the user's query to the most appropriate chain
			3. Handle variations: "BSC" = "Binance Smart Chain", "ETH" = "Ethereum", "Matic" = "Polygon"
			4. If no good match exists, return "NOT_FOUND"
			5. Be case-sensitive for the output - return the exact name from the list

			Examples:
			- User: "Ethereum" → "Ethereum"
			- User: "BSC" → "BSC"
			- User: "Binance Smart Chain" → "BSC"
			- User: "Polygon" → "Polygon"
			- User: "Matic" → "Polygon"

			Now find the chain name for the user query above:
		`;

		const result = await generateText({
			model: google(gemini25Flash),
			prompt,
			system: endent`
				You are a precise chain matcher. Return ONLY the exact chain name or NOT_FOUND. No explanations.
			`,
		});

		const chainName = result.text.trim();

		if (chainName === "NOT_FOUND") {
			logger.warn(`Could not resolve chain: ${name}`);
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
 * Resolve a stablecoin name/symbol to its ID using Gemini AI
 */
export async function resolveStablecoin(name: string): Promise<string | null> {
	try {
		const stablecoinsContext = stablecoins
			.map((s) => `${s.id}|${s.name}|${s.symbol}`)
			.join("\n");

		const prompt = endent`
			You are a stablecoin ID matcher for DefiLlama API.

			AVAILABLE STABLECOINS (format: id|name|symbol):
			${stablecoinsContext}

			USER QUERY: "${name}"

			Your task: Find the EXACT stablecoin ID that best matches the user's query.

			Rules:
			1. Return ONLY the numeric ID, nothing else
			2. Match the user's query to the most appropriate stablecoin by name or symbol
			3. Handle variations: "USDC" = "USD Coin" (ID: 2), "Tether" = "USDT" (ID: 1)
			4. If no good match exists, return "NOT_FOUND"

			Examples:
			- User: "USDC" → "2"
			- User: "USD Coin" → "2"
			- User: "Tether" → "1"
			- User: "USDT" → "1"
			- User: "DAI" → "5"

			Now find the ID for the user query above:
		`;

		const result = await generateText({
			model: google(gemini25Flash),
			prompt,
			system: endent`
				You are a precise stablecoin matcher. Return ONLY the numeric ID or NOT_FOUND. No explanations.
			`,
		});

		const id = result.text.trim();

		if (id === "NOT_FOUND") {
			logger.warn(`Could not resolve stablecoin: ${name}`);
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
 * Resolve a bridge name to its ID using Gemini AI
 */
export async function resolveBridge(name: string): Promise<number | null> {
	try {
		const bridgesContext = bridgeIds
			.map((b) => `${b.id}|${b.name}|${b.displayName}`)
			.join("\n");

		const prompt = endent`
			You are a bridge ID matcher for DefiLlama API.

			AVAILABLE BRIDGES (format: id|name|displayName):
			${bridgesContext}

			USER QUERY: "${name}"

			Your task: Find the EXACT bridge ID that best matches the user's query.

			Rules:
			1. Return ONLY the numeric ID, nothing else
			2. Match the user's query to the most appropriate bridge by name or display name
			3. Handle variations in naming
			4. If no good match exists, return "NOT_FOUND"

			Examples:
			- User: "Polygon Bridge" → "1"
			- User: "Stargate" → "12"
			- User: "Arbitrum" → "2"

			Now find the ID for the user query above:
		`;

		const result = await generateText({
			model: google(gemini25Flash),
			prompt,
			system: endent`
				You are a precise bridge matcher. Return ONLY the numeric ID or NOT_FOUND. No explanations.
			`,
		});

		const idStr = result.text.trim();

		if (idStr === "NOT_FOUND") {
			logger.warn(`Could not resolve bridge: ${name}`);
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
