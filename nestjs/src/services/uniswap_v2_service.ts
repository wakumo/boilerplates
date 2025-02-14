import { ChainId, WETH9 } from "@uniswap/sdk-core";
import ethers, { BigNumber, Contract } from 'ethers';
import { NATIVE_ADDRESS, UniswapV2RouterAddress } from "../commons/constants/blockchain.js";
import { UNISWAP_V2_ROUTER_ABI } from "../commons/constants/uniswap_v2_router_abi.js";
import { BlockchainService } from "./blockchain_service.js";
import { HelperService } from "./helper_service.js";
import { ERC20_ABI } from "../commons/constants/erc20_abi.js";

export interface ExportSwapTxParams {
  chainId: ChainId;
  functionName: string;
  tokenIn: string;
  tokenOut: string;
  amount: string;
  from: string;
  to: string;
  deadlineMinutes?: number;
  slippage?: number;
  decimalsTokenIn?: number;
  decimalsTokenOut?: number;
}

export class UniswapV2Service {
  static getPairAddress(chainId: ChainId, tokenIn: string, tokenOut: string) {}

  static genRouter02(chainId: ChainId) {
    const routerAddress = UniswapV2RouterAddress[chainId];
    const provider = BlockchainService.evmProvider(chainId);
    return new ethers.Contract(routerAddress, UNISWAP_V2_ROUTER_ABI, provider);
  }

  /**
   * @dev quote amount out for uniswap v2
   * @param router
   * @param amountIn
   * @param tokenIn
   * @param tokenOut
   * @returns
   */
  static async quoteAmountOut(router: Contract, amountIn: BigNumber, tokenIn: string, tokenOut: string) {
    const amountOut = await router.getAmountsOut(amountIn, [tokenIn, tokenOut]);
    return amountOut[1];
  }

  /**
   * @dev quote amount in for uniswap v2
   * @param router
   * @param amountOut
   * @param tokenIn
   * @param tokenOut
   * @returns
   */
  static async quoteAmountIn(router: Contract, amountOut: BigNumber, tokenIn: string, tokenOut: string) {
    const amountIn = await router.getAmountsIn(amountOut, [tokenIn, tokenOut]);
    return amountIn[0];
  }

  /**
   * @dev export swap tx for uniswap v2 with default slippage 25(0.25%)
   * @param functionName
   * @param tokenIn
   * @param tokenOut
   * @param amount
   * @param slippage
   */
  static async exportSwapTx(exportSwapTxParams: ExportSwapTxParams) {
    let {chainId, functionName, tokenIn, tokenOut, amount, to, from, deadlineMinutes, slippage, decimalsTokenIn, decimalsTokenOut} = exportSwapTxParams;
    slippage = slippage ?? 25;
    const router = this.genRouter02(chainId);
    let amountInBN, amountOutBN, allowance;
    let response;
    let txApprove;
    const deadline = this.swapDeadline(deadlineMinutes);
    switch (functionName) {
      case 'swapExactTokensForTokens':
          amountInBN = await BlockchainService.convertInWei(chainId, amount, tokenIn, false, decimalsTokenIn);
          response = await this.exportSwapExactTokensForTokens(router, tokenIn, tokenOut, amountInBN, to, deadline, slippage);
          allowance = await BlockchainService.getAllowance(chainId, tokenIn, from, router.address);

          if (allowance.lt(amountInBN)) {
            txApprove = this.exportApproveTx(tokenIn, from, router.address, amountInBN);
          }
          break;
      case 'swapTokensForExactTokens':
          amountOutBN = await BlockchainService.convertInWei(chainId, amount, tokenOut, false, decimalsTokenOut);
          response = await this.exportSwapTokensForExactTokens(router, tokenIn, tokenOut, amountOutBN, to, deadline, slippage);
          allowance = await BlockchainService.getAllowance(chainId, tokenIn, from, router.address);
          if (allowance.lt(response.args.amountInMax)) {
            txApprove = this.exportApproveTx(tokenIn, from, router.address, response.args.amountInMax);
          }
          break;
      case 'swapExactETHForTokens':
          amountInBN = await BlockchainService.convertInWei(chainId, amount, NATIVE_ADDRESS, false, 18);
          response = await this.exportSwapExactETHForTokens(router, tokenOut, amountInBN, to, deadline, slippage);
          break;
      case 'swapExactTokensForETH':
          amountInBN = await BlockchainService.convertInWei(chainId, amount, tokenIn, false, decimalsTokenIn);
          response = await this.exportSwapExactTokensForETH(router, tokenIn, to, amountInBN, deadline, slippage);
          allowance = await BlockchainService.getAllowance(chainId, tokenIn, from, router.address);
          if (allowance.lt(amountInBN)) {
            txApprove = this.exportApproveTx(tokenIn, from, router.address, amountInBN);
          }
          break;
      case 'swapETHForExactTokens':
          amountOutBN = await BlockchainService.convertInWei(chainId, amount, tokenOut, false, decimalsTokenOut);
          response = await this.exportSwapETHForExactTokens(router, tokenOut, to, amountOutBN, deadline, slippage);
          break;
    }
    let txs = [];
    if (txApprove) {
      txs.push(txApprove);
    }
    txs.push({
        ...response,
        args: {
          tokenIn,
          tokenOut,
          amount,
          to,
          deadline,
          slippage,
          functionName,
          decimalsTokenIn,
          decimalsTokenOut,
          ...response.args,
        },
      });
    return {txs, chainId};
  }

  static exportApproveTx(token: string, owner: string, spender: string, amount: string) {
    const erc20 = new ethers.utils.Interface(ERC20_ABI);
    const data = erc20.encodeFunctionData('approve', [spender, amount]);
    return {
      to: token,
      data,
      args: {
        from: owner,
        to: token,
        amount: amount.toString(),
      }
    }
  }

  static async exportSwapExactTokensForTokens(router: Contract, tokenIn: string, tokenOut: string, amountIn: BigNumber, to: string, deadline: number, slippage?: number) {
    const amountOut = await this.quoteAmountOut(router, amountIn, tokenIn, tokenOut);
    const amountOutMin = HelperService.convertSolPercentAmount(amountOut, slippage, -1); // 10000 - slippage * amountOut
    const tx = await router.populateTransaction.swapExactTokensForTokens(amountIn, amountOutMin, [tokenIn, tokenOut], to, deadline);
    return {
      ...tx,
      args: {
        amountIn: amountIn.toString(),
        amountOutMin: amountOutMin.toString(),
      }
    };
  }

  static async exportSwapTokensForExactTokens(router: Contract, tokenIn: string, tokenOut: string, amountOut: BigNumber, to: string, deadline: number, slippage?: number) {
    const amountIn = await this.quoteAmountIn(router, amountOut, tokenIn, tokenOut);
    const amountInMax = HelperService.convertSolPercentAmount(amountIn, slippage, 1); // 10000 + slippage * amountIn
    const tx = await router.populateTransaction.swapTokensForExactTokens(amountOut, amountInMax, [tokenIn, tokenOut], {
    }, to, deadline);
    return {
      ...tx,
      args: {
        amountOut: amountOut.toString(),
        amountInMax: amountInMax.toString(),
        functionName: 'swapTokensForExactTokens',
      },
    };
  }

  static async exportSwapExactETHForTokens(router: Contract, tokenOut: string, amountIn: BigNumber, to: string, deadline: number, slippage?: number) {
    const tokenIn = WETH9[(await router.provider.getNetwork()).chainId];
    const amountOut = await this.quoteAmountOut(router, amountIn, tokenIn.address, tokenOut);
    const amountOutMin = HelperService.convertSolPercentAmount(amountOut, slippage, -1); // 10000 - slippage * amountOut
    const tx = await router.populateTransaction.swapExactETHForTokens(amountOutMin, [tokenOut], to, deadline, {
      value: amountIn
    });
    return {
      ...tx,
      value: amountIn.toString(),
      args: {
        tokenIn: tokenIn.symbol,
        amountIn: amountIn.toString(),
        amountOutMin: amountOutMin.toString(),
      },
    };
  }

  static async exportSwapExactTokensForETH(router: Contract, tokenIn: string, to: string, amountIn: BigNumber, deadline: number, slippage?: number) {
    const tokenOut = WETH9[(await router.provider.getNetwork()).chainId];
    const amountOut = await this.quoteAmountOut(router, amountIn, tokenIn, tokenOut.address);
    const amountOutMin = HelperService.convertSolPercentAmount(amountOut, slippage, -1); // 10000 - slippage * amountOut
    const tx = await router.populateTransaction.swapExactTokensForETH(amountIn, amountOutMin, [tokenIn], to, deadline);
    return {
      ...tx,
      args: {
        tokenOut: tokenOut.symbol,
        amountIn: amountIn.toString(),
        amountOutMin: amountOutMin.toString(),
      },
    };
  }

  static async exportSwapETHForExactTokens(router: Contract, tokenOut: string, to: string, amountOut: BigNumber, deadline: number, slippage?: number) {
    const tokenIn = WETH9[(await router.provider.getNetwork()).chainId];
    const amountIn = await this.quoteAmountIn(router, amountOut, tokenIn.address, tokenOut);
    const amountInMax = HelperService.convertSolPercentAmount(amountIn, slippage, 1); // 10000 + slippage * amountIn
    const tx = await router.populateTransaction.swapETHForExactTokens(amountOut, [tokenOut], to, deadline, {
      value: amountInMax
    });
    return {
      ...tx,
      value: amountInMax.toString(),
      args: {
        tokenIn: tokenIn.symbol,
        amountIn: amountIn.toString(),
        amountOut: amountOut.toString(),
      },
    };
  }
  /**
   * @dev swap deadline is 30 minutes
   */
  static swapDeadline(minutes: number = 30) {
    const now = Math.floor(Date.now() / 1000) + minutes * 60;
    return now;
  }
}