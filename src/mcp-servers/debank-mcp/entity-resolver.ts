import endent from "endent";
import { createChildLogger } from "../../lib/utils/index.js";
import { chainIds } from "./enums/chains.js";
import { createResolver } from "./resolvers/base-resolver.js";
import { sanitizeChainId } from "./utils/sanitizers.js";
import { needsResolution } from "./utils/validators.js";

const logger = createChildLogger("DeBank Entity Resolver");

export { needsResolution };

const chainResolver = createResolver({
	entityType: "chain",
	entities: chainIds,
	getContext: (entities) =>
		entities.map((chain) => `${chain.name}: ${chain.id}`).join("\n"),
	sanitize: sanitizeChainId,
	validate: (chainId, entities) =>
		entities.some((chain) => chain.id === chainId),
	buildMessages: (name, context) => ({
		system: endent`
      You are a blockchain chain resolver for DeBank.
      Your job is to translate user-specified chain names or nicknames into the exact chain IDs from the provided list.
      Respond with the chain ID only (e.g., "eth"). If there is no confident match, reply with "__NOT_FOUND__".
      Never include explanations or extra text.

      Reference chains (format: Name: id):
      ${context}
    `,
		user: endent`
      Resolve the following user request to a DeBank chain ID.

      User input: "${name}"

      Rules:
      1. Match to the closest chain in the list and handle common aliases (e.g., "BSC" → "bsc", "Polygon" → "matic").
      2. If multiple chains seem plausible, choose the most widely used interpretation.
      3. If no valid chain exists, return "__NOT_FOUND__".

      Examples:
      - "Ethereum" → eth
      - "Binance Smart Chain" → bsc
      - "Arbitrum" → arb
      - "Made Up Chain" → __NOT_FOUND__

      Your response must be the chain ID only or "__NOT_FOUND__".
    `,
	}),
});

export async function resolveChain(name: string): Promise<string | null> {
	const resolver = await chainResolver;
	return await resolver(name);
}

export async function resolveChains(
	commaSeparated: string,
): Promise<string | null> {
	try {
		const names = commaSeparated.split(",").map((name) => name.trim());

		const resolvedPromises = names.map((name) => {
			if (!needsResolution(name, "chain")) {
				return Promise.resolve(name);
			}
			return resolveChain(name);
		});

		const resolved = await Promise.all(resolvedPromises);

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

export function resolveWrappedToken(
	tokenKeyword: string,
	chainId: string,
): string | null {
	try {
		const chain = chainIds.find((c) => c.id === chainId);

		if (!chain) {
			logger.warn(`Chain not found for ID: ${chainId}`);
			return null;
		}

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

export async function resolveEntities(
	args: Record<string, unknown>,
): Promise<void> {
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
}
