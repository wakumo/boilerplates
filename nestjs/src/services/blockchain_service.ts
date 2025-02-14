import { ChainId, Token } from "@uniswap/sdk-core";
import { MULTICALL3_ADDRESS, NATIVE_ADDRESS, Networks, TokenWhiteList } from "../commons/constants/blockchain.js";
import ethers, { BigNumber } from 'ethers';
import { ERC20_ABI } from "../commons/constants/erc20_abi.js";
export class BlockchainService {

  static evmProvider(chainId: number, url?: string) {
    const node_urls = Networks[chainId].node_urls;
    let index = 0;
    do {
      index = Math.floor(Math.random() * node_urls.length);
    } while (url === node_urls[index]);
    return new ethers.providers.JsonRpcProvider(node_urls[index]);
  }

  static async getAllowance(chainId: ChainId, token: string, owner: string, spender: string): Promise<BigNumber> {
    const provider = this.evmProvider(chainId);
    const contract = new ethers.Contract(token, ERC20_ABI, provider);
    const allowance: BigNumber = await contract.allowance(owner, spender);
    return allowance;
  }

  static async getDecimals(chainId: ChainId, address: string) {
    const tokens = TokenWhiteList[chainId];
    for (const [symbol, token] of Object.entries(tokens)) {
      if (token.address.toLowerCase() === address.toLowerCase()) {
        return token.decimals;
      }
    }
    const provider = this.evmProvider(chainId);
    const contract = new ethers.Contract(address, ERC20_ABI, provider);
    const decimals = await contract.decimals();
    return decimals;
  }

  static async convertInWei(chainId: ChainId, amount: string, token: string, isInWeiFormat: boolean = false, decimals?: number): Promise<BigNumber> {
    if (decimals) {
      return ethers.utils.parseUnits(amount, decimals);
    }
    if (token.toLowerCase() === NATIVE_ADDRESS.toLowerCase()) {
      return ethers.utils.parseEther(amount);
    }
    if (isInWeiFormat) {
      return ethers.BigNumber.from(amount);
    } else {
      const decimals = await this.getDecimals(chainId, token);
      return ethers.utils.parseUnits(amount, decimals);
    }
  }
}
