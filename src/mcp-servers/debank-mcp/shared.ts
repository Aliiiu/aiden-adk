/**
 * Shared utilities for DeBank MCP wrappers
 */

import { createChildLogger } from "../../lib/utils/index.js";
// import { resolveEntities } from "./entity-resolver.js"; // Disabled - now handled explicitly by agent
import {
	chainService,
	protocolService,
	tokenService,
	transactionService,
	userService,
} from "./services/index.js";

const logger = createChildLogger("DeBank MCP Shared");

/**
 * Map of service names to their instances
 */
const serviceMap = {
	chain: chainService,
	protocol: protocolService,
	token: tokenService,
	transaction: transactionService,
	user: userService,
} as const;

type ServiceName = keyof typeof serviceMap;

/**
 * Execute a DeBank service method by name
 * Returns raw JSON data for use in sandbox code execution
 *
 * NOTE: Parameter resolution is now handled explicitly by the agent using
 * discovery endpoints (getSupportedChainList, getAllProtocolsOfSupportedChains)
 * and JQTS filtering. Auto-resolution has been disabled for transparency.
 */
export async function executeServiceMethod(
	serviceName: ServiceName,
	methodName: string,
	params: Record<string, any>,
): Promise<any> {
	// Auto-resolution disabled - agent now handles parameter discovery explicitly
	// await resolveEntities(params);
	const service = serviceMap[serviceName];

	if (!service) {
		throw new Error(
			`Service '${serviceName}' not found. Available services: ${Object.keys(serviceMap).join(", ")}`,
		);
	}

	const method = (service as any)[methodName];
	if (!method || typeof method !== "function") {
		throw new Error(
			`Method '${methodName}' not found on service '${serviceName}'`,
		);
	}

	service.setRawOutputMode(true);

	logger.debug(
		`Executing ${serviceName}.${methodName}`,
		JSON.stringify(params),
	);

	try {
		logger.debug(`Method called with ${JSON.stringify(params)}`);
		const result = await method.call(service, params);

		logger.debug(`Method ${serviceName}.${methodName} completed successfully`);
		return result;
	} catch (error) {
		logger.error(`Method ${serviceName}.${methodName} failed:`, error);
		throw error;
	}
}
