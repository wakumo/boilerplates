import { ChainId, WETH9 } from '@uniswap/sdk-core';

export const MULTICALL3_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11';

export const Networks: Partial<Record<ChainId, { node_urls: string[] }>> = {
  [ChainId.MAINNET]: {
    node_urls: [
      'https://eth.llamarpc.com',
      'https://eth.rpc.blxrbdn.com',
      'https://ethereum-rpc.publicnode.com',
      'https://1rpc.io/eth',
      'https://rpc.mevblocker.io',
      'https://rpc.flashbots.net',
    ],
  },
  [ChainId.BNB]: {
    node_urls: [
      'https://binance.llamarpc.com',
      'https://bsc-dataseed.bnbchain.org',
      'https://bsc-dataseed1.bnbchain.org',
      'https://bsc-dataseed2.bnbchain.org',
      'https://bsc-dataseed3.bnbchain.org',
      'https://bsc-dataseed4.bnbchain.org',
      'https://bsc-dataseed1.defibit.io',
      'https://bsc-dataseed2.defibit.io',
      'https://bsc-dataseed3.defibit.io',
      'https://bsc-dataseed4.defibit.io',
      'https://bsc-dataseed1.ninicoin.io',
      'https://bsc-dataseed2.ninicoin.io',
      'https://bsc-dataseed3.ninicoin.io',
      'https://bsc-dataseed4.ninicoin.io',
    ],
  },
  [ChainId.POLYGON]: {
    node_urls: [
      'https://polygon.llamarpc.com',
      'https://rpc-mainnet.maticvigil.com',
      'https://polygon-rpc.com/',
      'https://polygon-pokt.nodies.app',
      'https://polygon-bor-rpc.publicnode.com',
      'https://1rpc.io/matic',
    ],
  },
  [ChainId.OPTIMISM]: {
    node_urls: [],
  },
  [ChainId.ARBITRUM_ONE]: {
    node_urls: [],
  },
};

export const NATIVE_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';


export const TokenWhiteList: Partial<Record<ChainId, Record<string, { address: string, decimals: number }>>> = {
  [ChainId.MAINNET]: {
    ETH: {
      address: WETH9[ChainId.MAINNET].address,
      decimals: 18,
    },
    DAI: {
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      decimals: 18,
    },
    WETH: {
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      decimals: 18,
    },
    USDT: {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      decimals: 6,
    },
    USDC: {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      decimals: 6,
    },
    BUSD: {
      address: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
      decimals: 18,
    },
    SOWAKA: {
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
    }
  },
  [ChainId.POLYGON]: {
    ETH: {
      address: WETH9[ChainId.POLYGON].address,
      decimals: 18,
    },
    USDC: {
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      decimals: 6,
    },
    SOWAKA: {
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
    }
  }
};

export const UniswapV2RouterAddress = {
  [ChainId.MAINNET]: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  [ChainId.BNB]: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
  [ChainId.POLYGON]: '0xedf6066a2b290C185783862C7F4776A2C8077AD1',
  [ChainId.OPTIMISM]: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  [ChainId.ARBITRUM_ONE]: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
};