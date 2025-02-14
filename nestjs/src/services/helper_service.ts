import ethers from 'ethers';
export class HelperService {

  /**
   * @dev convert percent amount to big number
   * percent is 10000 means 100%
   * 25 means 0.25%
   *
   *
   * @param amount
   * @param percent
   * @param way:
   *  + -1: (10000 - percent) * amount / 10000
   *  + 0: percent * amount / 10000
   *  + 1: (10000 + percent) * amount / 10000
   */
  static convertSolPercentAmount(amount: string | ethers.BigNumber, percent: number, way: number) {
    const amountBN = ethers.BigNumber.from(amount);
    const percentBN = ethers.BigNumber.from(percent);
    const hundredBN = ethers.BigNumber.from(10000);
    switch (way) {
      case -1:
        return hundredBN.sub(percentBN).mul(amountBN).div(hundredBN);
      case 0:
        return percentBN.mul(amountBN).div(hundredBN);
      case 1:
        return hundredBN.add(percentBN).mul(amountBN).div(hundredBN);
      default:
        throw new Error('Invalid way');
    }
  }
}
