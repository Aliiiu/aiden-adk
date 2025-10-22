/**
 * DeBank MCP Configuration
 */

export const config = {
	baseUrl: "https://pro-openapi.debank.com/v1",
	debankDefaultLifeTime: 30 * 60, // 5 minutes
	poolDataLifeTime: 600, // 10 minutes
	gasPriceLifeTime: 60, // 1 minute
	supportedChainListLifeTime: 604800, // 7 days
	protocolsListLifeTime: 604800, // 7 days
};
