import { createChildLogger } from "../../lib/utils/index";
import {
	blockchainService,
	dexService,
	feesService,
	optionsService,
	priceService,
	protocolService,
	stablecoinService,
	yieldService,
} from "./services/index";

const logger = createChildLogger("DefiLlama MCP Shared");

/**
 * Map of service names to their instances
 */
export const serviceMap = {
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
 * Execute a service method by name using strings
 */
export async function executeServiceMethod(
	serviceName: string,
	methodName: string,
	params?: Record<string, unknown>,
): Promise<unknown> {
	const service = serviceMap[serviceName as ServiceName];

	if (!service) {
		throw new Error(
			`Service '${serviceName}' not found. Available services: ${Object.keys(serviceMap).join(", ")}`,
		);
	}

	const method = service[methodName as keyof typeof service];

	if (typeof method !== "function") {
		throw new Error(
			`Method '${methodName}' not found on service '${serviceName}'`,
		);
	}

	// Call setRawOutputMode if it exists
	if (
		"setRawOutputMode" in service &&
		typeof service.setRawOutputMode === "function"
	) {
		service.setRawOutputMode(true);
	}

	logger.debug(
		`Executing ${serviceName}.${methodName}`,
		JSON.stringify(params),
	);

	try {
		const result = await (
			method as (params?: Record<string, unknown>) => Promise<unknown>
		).call(service, params);
		logger.debug(`Method ${serviceName}.${methodName} completed successfully`);
		return result;
	} catch (error) {
		logger.error(`Method ${serviceName}.${methodName} failed:`, error);
		throw error;
	}
}
