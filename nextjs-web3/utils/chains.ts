import { BLOCKCHAIN_NETWORK } from "./constant";

const BNB = {
  name: "BNB",
  symbol: "BNB",
  decimals: 18,
};

const ETH = {
  name: "Ether",
  symbol: "ETH",
  decimals: 18,
};

export const KNOWN_CHAINS = new Map([
  [
    1,
    {
      id: 1,
      nativeCurrency: ETH,
      fullName: "Ethereum",
      explorerUrl: `https://etherscan.io`,
      networks: "mainnet",
      blockchainName: "ethereum",
    },
  ],
  [
    4,
    {
      id: 4,
      nativeCurrency: ETH,
      fullName: "Ethereum Rinkeby",
      explorerUrl: `https://rinkeby.etherscan.io`,
      networks: "testnet",
      blockchainName: "ethereum",
    },
  ],
  [
    56,
    {
      id: 56,
      nativeCurrency: BNB,
      fullName: "Binance Smart Chain",
      explorerUrl: `https://bscscan.com`,
      networks: "mainnet",
      blockchainName: "bsc",
    },
  ],
  [
    97,
    {
      id: 97,
      nativeCurrency: BNB,
      fullName: "Binance Smart Chain Testnet",
      explorerUrl: `https://testnet.bscscan.com`,
      networks: "testnet",
      blockchainName: "bsc",
    },
  ],
]);

export const ADDED_CHAINS = [
  {
    chainId: "0x38", //56
    chainName: KNOWN_CHAINS.get(56)?.fullName,
    nativeCurrency: BNB,
    rpcUrls: ["https://bsc-dataseed1.ninicoin.io/"],
    blockExplorerUrls: [KNOWN_CHAINS.get(56)?.explorerUrl],
  },
  {
    chainId: "0x61", // 97
    chainName: KNOWN_CHAINS.get(97)?.fullName,
    nativeCurrency: BNB,
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
    blockExplorerUrls: [KNOWN_CHAINS.get(97)?.explorerUrl],
  },
];

export const NETWORK_CHAINS = Array.from(KNOWN_CHAINS.values()).reduce(
  (result: any, chain: any) => {
    if (chain.networks && chain.networks.includes(BLOCKCHAIN_NETWORK)) {
      result.push(chain);
    }
    return result;
  },
  []
);

export const NETWORK_CHAIN_IDS = NETWORK_CHAINS.reduce(
  (result: Array<number>, chain: any) => {
    chain.id && result.push(chain.id);
    return result;
  },
  []
);
