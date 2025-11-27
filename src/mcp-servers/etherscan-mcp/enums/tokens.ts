/**
 * Top ~100 Most Popular ERC-20 Token Contracts on Ethereum Mainnet
 * Selected based on market cap, trading volume, and usage frequency
 *
 * Note: This is a curated list to keep function descriptions concise.
 * For tokens not in this list, users should provide the full contract address.
 */

export const tokenIds = [
	// Stablecoins
	{
		name: "Tether",
		symbol: "USDT",
		id: "0xdac17f958d2ee523a2206206994597c13d831ec7",
	},
	{
		name: "USD Coin",
		symbol: "USDC",
		id: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
	},
	{
		name: "Dai Stablecoin",
		symbol: "DAI",
		id: "0x6b175474e89094c44da98b954eedeac495271d0f",
	},
	{
		name: "Binance USD",
		symbol: "BUSD",
		id: "0x4fabb145d64652a948d72533023f6e7a623c7c53",
	},
	{
		name: "TrueUSD",
		symbol: "TUSD",
		id: "0x0000000000085d4780b73119b644ae5ecd22b376",
	},
	{
		name: "Pax Dollar",
		symbol: "USDP",
		id: "0x8e870d67f660d95d5be530380d0ec0bd388289e1",
	},
	{
		name: "Frax",
		symbol: "FRAX",
		id: "0x853d955acef822db058eb8505911ed77f175b99e",
	},
	{
		name: "Gemini Dollar",
		symbol: "GUSD",
		id: "0x056fd409e1d7a124bd7017459dfea2f387b6d5cd",
	},
	{
		name: "Liquity USD",
		symbol: "LUSD",
		id: "0x5f98805a4e8be255a32880fdec7f6728c6568ba0",
	},
	{
		name: "sUSD",
		symbol: "sUSD",
		id: "0x57ab1ec28d129707052df4df418d58a2d46d5f51",
	},

	// Wrapped Assets
	{
		name: "Wrapped Bitcoin",
		symbol: "WBTC",
		id: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
	},
	{
		name: "Wrapped Ether",
		symbol: "WETH",
		id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
	},

	// Liquid Staking
	{
		name: "Lido Staked Ether",
		symbol: "stETH",
		id: "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
	},
	{
		name: "Rocket Pool ETH",
		symbol: "rETH",
		id: "0xae78736cd615f374d3085123a210448e74fc6393",
	},
	{
		name: "Frax Ether",
		symbol: "frxETH",
		id: "0x5e8422345238f34275888049021821e8e08caa1f",
	},
	{
		name: "Swell Ethereum",
		symbol: "swETH",
		id: "0xf951e335afb289353dc249e82926178eac7ded78",
	},
	{
		name: "Ankr Staked ETH",
		symbol: "ankrETH",
		id: "0xe95a203b1a91a908f9b9ce46459d101078c2c3cb",
	},

	// Layer 2 / Scaling
	{
		name: "Polygon",
		symbol: "MATIC",
		id: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
	},
	{
		name: "Arbitrum",
		symbol: "ARB",
		id: "0x912ce59144191c1204e64559fe8253a0e49e6548",
	},
	{
		name: "Optimism",
		symbol: "OP",
		id: "0x4200000000000000000000000000000000000042",
	},
	{
		name: "Mantle",
		symbol: "MNT",
		id: "0x3c3a81e81dc49a522a592e7622a7e711c06bf354",
	},
	{
		name: "Immutable X",
		symbol: "IMX",
		id: "0xf57e7e7c23978c3caec3c3548e3d615c346e79ff",
	},
	{
		name: "Metis",
		symbol: "METIS",
		id: "0x9e32b13ce7f2e80a01932b42553652e053d6ed8e",
	},
	{
		name: "Loopring",
		symbol: "LRC",
		id: "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
	},
	{
		name: "Cartesi",
		symbol: "CTSI",
		id: "0x491604c0fdf08347dd1fa4ee062a822a5dd06b5d",
	},
	{
		name: "Celer Network",
		symbol: "CELR",
		id: "0x4f9254c83eb525f9fcf346490bbb3ed28a81c667",
	},

	// DeFi Blue Chips
	{
		name: "Uniswap",
		symbol: "UNI",
		id: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
	},
	{
		name: "Chainlink",
		symbol: "LINK",
		id: "0x514910771af9ca656af840dff83e8264ecf986ca",
	},
	{
		name: "Aave",
		symbol: "AAVE",
		id: "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
	},
	{
		name: "Maker",
		symbol: "MKR",
		id: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
	},
	{
		name: "Synthetix Network Token",
		symbol: "SNX",
		id: "0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f",
	},
	{
		name: "Curve DAO Token",
		symbol: "CRV",
		id: "0xd533a949740bb3306d119cc777fa900ba034cd52",
	},
	{
		name: "Lido DAO",
		symbol: "LDO",
		id: "0x5a98fcbea516cf06857215779fd812ca3bef1b32",
	},
	{
		name: "Compound",
		symbol: "COMP",
		id: "0xc00e94cb662c3520282e6f5717214004a7f26888",
	},
	{
		name: "Rocket Pool",
		symbol: "RPL",
		id: "0xd33526068d116ce69f19a9ee46f0bd304f21a51f",
	},
	{
		name: "1inch Network",
		symbol: "1INCH",
		id: "0x111111111117dc0aa78b770fa6a738034120c302",
	},
	{
		name: "Balancer",
		symbol: "BAL",
		id: "0xba100000625a3754423978a60c9317c58a424e3d",
	},
	{
		name: "Sushi",
		symbol: "SUSHI",
		id: "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2",
	},
	{
		name: "Frax Share",
		symbol: "FXS",
		id: "0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0",
	},
	{
		name: "yearn.finance",
		symbol: "YFI",
		id: "0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e",
	},
	{
		name: "Bancor Network",
		symbol: "BNT",
		id: "0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c",
	},
	{
		name: "Kyber Network Crystal",
		symbol: "KNC",
		id: "0xdefa4e8a7bcba345f687a2f1456f5edd9ce97202",
	},
	{
		name: "UMA",
		symbol: "UMA",
		id: "0x04fa0d235c4abf4bcf4787af4cf447de572ef828",
	},
	{
		name: "Ren",
		symbol: "REN",
		id: "0x408e41876cccdc0f92210600ef50372656052a38",
	},
	{
		name: "Gnosis",
		symbol: "GNO",
		id: "0x6810e776880c02933d47db1b9fc05908e5386b96",
	},
	{
		name: "Convex Finance",
		symbol: "CVX",
		id: "0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b",
	},
	{
		name: "dYdX",
		symbol: "DYDX",
		id: "0x92d6c1e31e14520e676a687f0a93788b716beff5",
	},
	{
		name: "Pendle",
		symbol: "PENDLE",
		id: "0x808507121b80c02388fad14726482e061b8da827",
	},
	{
		name: "GMX",
		symbol: "GMX",
		id: "0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a",
	},

	// Exchange Tokens
	{
		name: "LEO Token",
		symbol: "LEO",
		id: "0x2af5d2ad76741191d15dfe7bf6ac92d4bd912ca3",
	},
	{
		name: "OKB",
		symbol: "OKB",
		id: "0x75231f58b43240c9718dd58b4967c5114342a86c",
	},
	{
		name: "Gate Token",
		symbol: "GT",
		id: "0xe66747a101bff2dba3697199dcce5b743b454759",
	},
	{
		name: "Bitget Token",
		symbol: "BGB",
		id: "0x19de6b897ed14a376dda0fe53a5420d2ac828a28",
	},
	{
		name: "MX",
		symbol: "MX",
		id: "0x11eef04c884e24d9b7b4760e7476d06ddf797f36",
	},
	{
		name: "WOO",
		symbol: "WOO",
		id: "0x4691937a7508860f876c9c0a2a617e7d9e945d4b",
	},
	{
		name: "NEXO",
		symbol: "NEXO",
		id: "0xb62132e35a6c13ee1ee0f84dc5d40bad8d815206",
	},

	// Meme Tokens
	{
		name: "Shiba Inu",
		symbol: "SHIB",
		id: "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
	},
	{
		name: "Pepe",
		symbol: "PEPE",
		id: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
	},
	{
		name: "Dogelon Mars",
		symbol: "ELON",
		id: "0x761d38e5ddf6ccf6cf7c55759d5210750b5d60f3",
	},
	{
		name: "Baby Doge Coin",
		symbol: "BabyDoge",
		id: "0xc748673057861a797275cd8a068abb95a902e8de",
	},

	// Infrastructure & AI
	{
		name: "The Graph",
		symbol: "GRT",
		id: "0xc944e90c64b2c07662a292be6244bdf05cda44a7",
	},
	{
		name: "Render Token",
		symbol: "RNDR",
		id: "0x6de037ef9ad2725eb40118bb1702ebb27e4aeb24",
	},
	{
		name: "Fetch.ai",
		symbol: "FET",
		id: "0xaea46a60368a7bd060eec7df8cba43b7ef41ad85",
	},
	{
		name: "Worldcoin",
		symbol: "WLD",
		id: "0x163f8c2467924be0ae7b5347228cabf260318753",
	},
	{
		name: "SingularityNET",
		symbol: "AGIX",
		id: "0x5b7533812759b45c2b44c19e320ba2cd2681b542",
	},
	{
		name: "Ocean Protocol",
		symbol: "OCEAN",
		id: "0x967da4048cd07ab37855c090aaf366e4ce1b9f48",
	},
	{
		name: "iExec RLC",
		symbol: "RLC",
		id: "0x607f4c5bb672230e8672085532f7e901544a7375",
	},
	{
		name: "Numeraire",
		symbol: "NMR",
		id: "0x1776e1f26f98b1a5df9cd347953a26dd3cb46671",
	},
	{
		name: "API3",
		symbol: "API3",
		id: "0x0b38210ea11411557c13457d4da7dc6ea731b88a",
	},
	{
		name: "Arkham",
		symbol: "ARKM",
		id: "0x6e2a43be0b1d33b726f0ca3b8de60b3482b8b050",
	},

	// Gaming & Metaverse
	{
		name: "ApeCoin",
		symbol: "APE",
		id: "0x4d224452801aced8b2f0aebe155379bb5d594381",
	},
	{
		name: "The Sandbox",
		symbol: "SAND",
		id: "0x3845badade8e6dff049820680d1f14bd3903a5d0",
	},
	{
		name: "Axie Infinity",
		symbol: "AXS",
		id: "0xbb0e17ef65f82ab018d8edd776e8dd940327b28b",
	},
	{
		name: "Gala",
		symbol: "GALA",
		id: "0xd1d2eb1b1e90b638588728b4130137d262c87cae",
	},
	{
		name: "Illuvium",
		symbol: "ILV",
		id: "0x767fe9edc9e0df98e07454847909b5e959d7ca0e",
	},
	{
		name: "Magic",
		symbol: "MAGIC",
		id: "0x539bde0d7dbd336b79148aa742883198bbf60342",
	},
	{
		name: "Enjin Coin",
		symbol: "ENJ",
		id: "0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c",
	},
	{
		name: "Ultra",
		symbol: "UOS",
		id: "0xd13c7342e1ef687c5ad21b27c2b65d772cab5c8c",
	},
	{
		name: "Vulcan Forged",
		symbol: "PYR",
		id: "0x430ef9263e76dae63c84292c3409d61c598e9682",
	},
	{
		name: "Yield Guild Games",
		symbol: "YGG",
		id: "0x25f8087ead173b73d6e8b84329989a8eea16cf73",
	},
	{
		name: "My Neighbor Alice",
		symbol: "ALICE",
		id: "0xac51066d7bec65dc4589368da368b212745d63e8",
	},
	{
		name: "Mobox",
		symbol: "MBOX",
		id: "0x3203c9e46ca618c8c1ce5dc67e7e9d75f5da2377",
	},

	// Other Notable Projects
	{
		name: "Quant",
		symbol: "QNT",
		id: "0x4a220e6096b25eadb88358cb44068a3248254675",
	},
	{
		name: "PAX Gold",
		symbol: "PAXG",
		id: "0x45804880de22913dafe09f4980848ece6ecbaf78",
	},
	{
		name: "Tether Gold",
		symbol: "XAUT",
		id: "0x68749665ff8d2d112fa859aa293f07a622782f38",
	},
	{
		name: "Chiliz",
		symbol: "CHZ",
		id: "0x3506424f91fd33084466f402d5d97f05f8e3b4af",
	},
	{
		name: "Basic Attention",
		symbol: "BAT",
		id: "0x0d8775f648430679a709e98d2b0cb6250d2887ef",
	},
	{
		name: "Holo",
		symbol: "HOT",
		id: "0x6c6ee5e31d828de241282b9606c8e98ea48526e2",
	},
	{
		name: "OMG Network",
		symbol: "OMG",
		id: "0xd26114cd6ee289accf82350c8d8487fedb8a0c07",
	},
	{
		name: "Golem",
		symbol: "GLM",
		id: "0x7dd9c5cba05e151c895fde1cf355c9a1d5da6429",
	},
	{
		name: "Status",
		symbol: "SNT",
		id: "0x744d70fdbe2ba4cf95131626614a1763df805b9e",
	},
	{
		name: "Powerledger",
		symbol: "POWR",
		id: "0x595832f8fc6bf59c85c527fec3740a1b7a361269",
	},
	{
		name: "Civic",
		symbol: "CVC",
		id: "0x41e5560054824ea6b0732e656e3ad64e20e94e45",
	},
	{
		name: "Ankr Network",
		symbol: "ANKR",
		id: "0x8290333cef9e6d528dd5618fb97a76f268f3edd4",
	},
	{
		name: "Ethereum Name Service",
		symbol: "ENS",
		id: "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72",
	},
	{
		name: "Blur",
		symbol: "BLUR",
		id: "0x5283d291dbcf85356a21ba090e6db59121208b44",
	},
	{
		name: "Oasis Network",
		symbol: "ROSE",
		id: "0xf00600ebc7633462bc4f9c61ea2ce99f5aaebd4a",
	},
	{
		name: "SXP",
		symbol: "SXP",
		id: "0x8ce9137d39326ad0cd6491fb5cc0cba0e089b6a9",
	},
	{
		name: "Audius",
		symbol: "AUDIO",
		id: "0x18aaa7115705e8be94bffebde57af9bfc265b998",
	},
] as const;

/**
 * Generate a formatted string of all tokens for LLM context
 */
export function getTokensDescription(): string {
	return tokenIds
		.map((token) => `${token.symbol} (${token.name}): ${token.id}`)
		.join(", ");
}
