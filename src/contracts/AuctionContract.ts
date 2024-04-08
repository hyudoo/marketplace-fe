import { IAuctionInfo } from "@/_types_";
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

  getAuction = async (_productId: number) => {
    const rs = await this._contract.getAuction(_productId);
    const item = {
      author: rs[0],
      initialPrice: this._toEther(rs[1]),
      productId: this._toNumber(rs[2]),
      lastBid: this._toEther(rs[3]),
      lastBidder: rs[4],
      startTime: (this._toNumber(rs[5]) as number) * 1000,
      endTime: (this._toNumber(rs[6]) as number) * 1000,
    };
    return item;
  };

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
    console.log({ _productId, bid });
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

  getProductListedOnAuction = async () => {
    const rs = await this._contract.getListedProducts();
    const results = [];
    for (let i = 0; i < rs.length; i++) {
      const o = rs[i];
      const item = {
        author: o[0],
        initialPrice: this._toEther(o[1]),
        productId: this._toNumber(o[2]),
        lastBid: this._toEther(o[3]),
        lastBidder: o[4],
        startTime: (this._toNumber(o[5]) as number) * 1000,
        endTime: (this._toNumber(o[6]) as number) * 1000,
      };
      results.push(item);
    }
    console.log("results", results);

    return results;
  };

  getMyProductListed = async (address: string) => {
    const products = await this.getProductListedOnAuction();
    return products.filter((p: any) => p.author === address);
  };
}
