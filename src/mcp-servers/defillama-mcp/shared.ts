/**
 * Shared utilities for DefiLlama MCP wrappers
 */

import { createChildLogger } from "../../lib/utils/index.js";
// import { autoResolveEntities } from "./tools.js"; // Disabled - now handled explicitly by agent
import {
	blockchainService,
	dexService,
	feesService,
	optionsService,
	priceService,
	protocolService,
	stablecoinService,
	yieldService,
} from "./services/index.js";

const logger = createChildLogger("DefiLlama MCP Shared");

/**
 * Map of service names to their instances
 */
const serviceMap = {
	blockchain: blockchainService,
	dex: dexService,
	fees: feesService,
	options: optionsService,
	price: priceService,
	protocol: protocolService,
	stablecoin: stablecoinService,
	yield: yieldService,
} as const;

type ServiceName = keyof typeof serviceMap;

/**
 * Execute a DefiLlama service method by name
 * Returns raw JSON data for use in code execution
 *
 * NOTE: Parameter resolution is now handled explicitly by the agent using
 * discovery endpoints (getProtocols, getChains) and JQTS filtering.
 * Auto-resolution has been disabled for transparency.
 */
export async function executeServiceMethod(
	serviceName: ServiceName,
	methodName: string,
	params: Record<string, any>,
): Promise<any> {
	// Auto-resolution disabled - agent now handles parameter discovery explicitly
	// await autoResolveEntities(params);
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

	logger.debug(
		`Executing ${serviceName}.${methodName}`,
		JSON.stringify(params),
	);

	try {
		service.setRawOutput(true);

		logger.debug(`Method called with ${JSON.stringify(params)}`);
		const result = await method.call(service, params);

		service.setRawOutput(false);

		logger.debug(`Method ${serviceName}.${methodName} completed successfully`);
		return result;
	} catch (error) {
		service.setRawOutput(false);
		logger.error(`Method ${serviceName}.${methodName} failed:`, error);
		throw error;
	} finally {
		service.setRawOutput(false);
	}
}
