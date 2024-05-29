import { TransactionResponse } from "@ethersproject/abstract-provider";
import { IProductInfo } from "@/_types_";
import { ethers, keccak256 } from "ethers";
import { getRPC } from "./utils/common";
import { Erc721 } from "./interfaces";
import { getProductAbi } from "./utils/getAbis";
import { getProductAddress } from "./utils/getAddress";
import { BigNumberish } from "ethers";

export default class ProductContract extends Erc721 {
  constructor(provider?: ethers.JsonRpcSigner) {
    const rpcProvider = new ethers.JsonRpcProvider(getRPC());
    super(provider || rpcProvider, getProductAddress(), getProductAbi());
    if (!provider) {
      this._contract = new ethers.Contract(
        this._contractAddress,
        this._abis,
        rpcProvider
      );
    }
  }

  addProduct = async (data: any) => {
    const tx: TransactionResponse = await this._contract.mint(
      data.address,
      data.cid
    );
    return this._handleTransactionResponse(tx);
  };
}
