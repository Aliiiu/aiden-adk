/**
 * Etherscan Supported Chains
 * Chain IDs from reference list (name + id only).
 */

export const etherscanChains = [
	{ id: "1", name: "Ethereum Mainnet" },
	{ id: "11155111", name: "Sepolia Testnet" },
	{ id: "17000", name: "Holesky Testnet" },
	{ id: "560048", name: "Hoodi Testnet" },
	{ id: "2741", name: "Abstract Mainnet" },
	{ id: "11124", name: "Abstract Sepolia Testnet" },
	{ id: "33111", name: "ApeChain Curtis Testnet" },
	{ id: "33139", name: "ApeChain Mainnet" },
	{ id: "42170", name: "Arbitrum Nova Mainnet" },
	{ id: "42161", name: "Arbitrum One Mainnet" },
	{ id: "421614", name: "Arbitrum Sepolia Testnet" },
	{ id: "43114", name: "Avalanche C-Chain" },
	{ id: "43113", name: "Avalanche Fuji Testnet" },
	{ id: "8453", name: "Base Mainnet" },
	{ id: "84532", name: "Base Sepolia Testnet" },
	{ id: "80069", name: "Berachain Bepolia Testnet" },
	{ id: "80094", name: "Berachain Mainnet" },
	{ id: "199", name: "BitTorrent Chain Mainnet" },
	{ id: "1029", name: "BitTorrent Chain Testnet" },
	{ id: "81457", name: "Blast Mainnet" },
	{ id: "168587773", name: "Blast Sepolia Testnet" },
	{ id: "56", name: "BNB Smart Chain Mainnet" },
	{ id: "97", name: "BNB Smart Chain Testnet" },
	{ id: "42220", name: "Celo Mainnet" },
	{ id: "11142220", name: "Celo Sepolia Testnet" },
	{ id: "252", name: "Fraxtal Mainnet" },
	{ id: "2523", name: "Fraxtal Hoodi Testnet" },
	{ id: "100", name: "Gnosis" },
	{ id: "999", name: "HyperEVM Mainnet" },
	{ id: "737373", name: "Katana Bokuto" },
	{ id: "747474", name: "Katana Mainnet" },
	{ id: "59144", name: "Linea Mainnet" },
	{ id: "59141", name: "Linea Sepolia Testnet" },
	{ id: "5000", name: "Mantle Mainnet" },
	{ id: "5003", name: "Mantle Sepolia Testnet" },
	{ id: "43521", name: "Memecore Testnet" },
	{ id: "143", name: "Monad Mainnet" },
	{ id: "10143", name: "Monad Testnet" },
	{ id: "1287", name: "Moonbase Alpha Testnet" },
	{ id: "1284", name: "Moonbeam Mainnet" },
	{ id: "1285", name: "Moonriver Mainnet" },
	{ id: "10", name: "OP Mainnet" },
	{ id: "11155420", name: "OP Sepolia Testnet" },
	{ id: "204", name: "opBNB Mainnet" },
	{ id: "5611", name: "opBNB Testnet" },
	{ id: "80002", name: "Polygon Amoy Testnet" },
	{ id: "137", name: "Polygon Mainnet" },
	{ id: "534352", name: "Scroll Mainnet" },
	{ id: "534351", name: "Scroll Sepolia Testnet" },
	{ id: "1329", name: "Sei Mainnet" },
	{ id: "1328", name: "Sei Testnet" },
	{ id: "146", name: "Sonic Mainnet" },
	{ id: "14601", name: "Sonic Testnet" },
	{ id: "988", name: "Stable Mainnet *Coming Soon" },
	{ id: "2201", name: "Stable Testnet" },
	{ id: "1923", name: "Swellchain Mainnet" },
	{ id: "1924", name: "Swellchain Testnet" },
	{ id: "167013", name: "Taiko Hoodi" },
	{ id: "167000", name: "Taiko Mainnet" },
	{ id: "130", name: "Unichain Mainnet" },
	{ id: "1301", name: "Unichain Sepolia Testnet" },
	{ id: "480", name: "World Mainnet" },
	{ id: "4801", name: "World Sepolia Testnet" },
	{ id: "51", name: "XDC Apothem Testnet" },
	{ id: "50", name: "XDC Mainnet" },
	{ id: "324", name: "zkSync Mainnet" },
	{ id: "300", name: "zkSync Sepolia Testnet" },
] as const;

/**
 * Generate a formatted string of all chains for LLM context
 */
export function getChainsDescription(): string {
	return etherscanChains
		.map((chain) => `${chain.name}: ${chain.id}`)
		.join(", ");
}
