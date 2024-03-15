import { TransactionResponse } from "@ethersproject/abstract-provider";
import { ethers } from "ethers";
import { BaseInterface } from "./interfaces";
import { getRPC } from "./utils/common";
import { getCrowdSaleAbi } from "./utils/getAbis";
import { getCrowdSaleAddress } from "./utils/getAddress";
import { BigNumberish } from "ethers";

export default class CrowdSaleContract extends BaseInterface {
  constructor(provider?: ethers.JsonRpcSigner) {
    const rpcProvider = new ethers.JsonRpcProvider(getRPC());
    super(provider || rpcProvider, getCrowdSaleAddress(), getCrowdSaleAbi());
    if (!provider) {
      this._contract = new ethers.Contract(
        this._contractAddress,
        this._abis,
        rpcProvider
      );
    }
  }

  async getBnbRate(): Promise<number> {
    let rate = await this._contract.BNB_rate();
    return this._toNumber(rate) as number;
  }

  async buyTokenByBNB(amount: number) {
    const rate = await this.getBnbRate();
    const tx: TransactionResponse = await this._contract.buyTokenByBNB({
      ...this._option,
      value: this._numberToEth(amount / rate) as BigNumberish,
    });
    return this._handleTransactionResponse(tx);
  }
}
