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

  getAuctionByStatus = async () => {
    const rs = await this._contract.getAuctionByStatus(false);
    const results = [];
    for (let i = 0; i < rs.length; i++) {
      const o = rs[i];
      const item = {
        author: o[0],
        productId: this._toNumber(o[1]) as number,
        initialPrice: this._toEther(o[2]),
        previousBidder: o[3],
        lastBid: this._toEther(o[4]),
        lastBidder: o[5],
        startTime: (this._toNumber(o[6]) as number) * 1000,
        endTime: (this._toNumber(o[7]) as number) * 1000,
        completed: o[8],
        auctionId: this._toNumber(o[9]) as number,
      };
      results.push(item);
    }
    return results;
  };

  getAuctionByAddress = async (address: string) => {
    const rs = await this._contract.getAuctionByStatus(false);
    const results = [];
    for (let i = 0; i < rs.length; i++) {
      const o = rs[i];
      if (o[0] == address) {
        const item = {
          productId: this._toNumber(o[1]) as number,
          price: this._toEther(o[2]),
          lastBid: this._toEther(o[4]),
          lastBidder: o[5],
          startTime: this._toNumber(o[6]) as number,
          endTime: this._toNumber(o[7]) as number,
          auctionId: this._toNumber(o[9]) as number,
        };
        results.push(item);
      }
    }
    return results;
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

  cancelAuction = async (auctionId: number) => {
    const tx = await this._contract.cancelAuction(auctionId, this._option);
    return this._handleTransactionResponse(tx);
  };

  joinAuction = async (auctionId: number, bid: number) => {
    console.log({ auctionId, bid });
    const tx = await this._contract.joinAuction(
      auctionId,
      this._numberToEth(bid),
      this._option
    );
    return this._handleTransactionResponse(tx);
  };
}
