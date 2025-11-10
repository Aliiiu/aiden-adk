/**
 * Shared utilities for DeBank MCP wrappers
 */

import { createChildLogger } from "../../lib/utils/index.js";
import { resolveEntities } from "./entity-resolver.js";
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
 * Returns raw JSON data for use in code execution
 */
export async function executeServiceMethod(
	serviceName: ServiceName,
	methodName: string,
	params: Record<string, any>,
): Promise<any> {
	// Normalize human-readable inputs (e.g., chain names) before hitting the services
	await resolveEntities(params);
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
		// Enable raw output mode for code execution
		service.setRawOutput(true);

		logger.debug(`Method called with ${JSON.stringify(params)}`);
		const result = await method.call(service, params);

		// Reset to formatted output mode after successful execution
		service.setRawOutput(false);

		logger.debug(`Method ${serviceName}.${methodName} completed successfully`);
		return result;
	} catch (error) {
		// Reset to formatted output mode in case of error
		service.setRawOutput(false);
		logger.error(`Method ${serviceName}.${methodName} failed:`, error);
		throw error;
	} finally {
		// Ensure rawOutput is always reset
		service.setRawOutput(false);
	}
}
