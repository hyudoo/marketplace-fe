import { ethers } from "ethers";
import { Erc721 } from "./interfaces";
import { getRPC } from "./utils/common";
import { getAuctionAbi } from "./utils/getAbis";
import { getAuctionAddress } from "./utils/getAddress";

export default class AuctionContract extends Erc721 {
  constructor(provider?: ethers.JsonRpcSigner) {
    const rpcProvider = new ethers.JsonRpcProvider(getRPC());
    super(provider || rpcProvider, getAuctionAddress(), getAuctionAbi());
    if (!provider) {
      this._contract = new ethers.Contract(
        this._contractAddress,
        this._abis,
        rpcProvider
      );
    }
  }

  createAuction = async (
    productId: number,
    initialPrice: number,
    startTime: number,
    endTime: number
  ) => {
    const tx = await this._contract.createAuction(
      productId,
      this._numberToEth(initialPrice),
      startTime,
      endTime,
      this._option
    );
    return this._handleTransactionResponse(tx);
  };

  cancelAuction = async (_productId: number) => {
    const tx = await this._contract.cancelAuction(_productId, this._option);
    return this._handleTransactionResponse(tx);
  };

  joinAuction = async (_productId: number, bid: number) => {
    const tx = await this._contract.joinAuction(
      _productId,
      this._numberToEth(bid),
      this._option
    );
    return this._handleTransactionResponse(tx);
  };

  finishAuction = async (_productId: number) => {
    const tx = await this._contract.finishAuction(_productId, this._option);
    return this._handleTransactionResponse(tx);
  };
}
