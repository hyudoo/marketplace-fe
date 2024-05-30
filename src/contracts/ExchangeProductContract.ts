import { ethers } from "ethers";
import { Erc721 } from "./interfaces";
import { getRPC } from "./utils/common";
import { getExchangeProductAbi } from "./utils/getAbis";
import { getExchangeProductAddress } from "./utils/getAddress";
import { IExchange } from "@/_types_";

export default class ExchangeProductContract extends Erc721 {
  constructor(provider?: ethers.JsonRpcSigner) {
    const rpcProvider = new ethers.JsonRpcProvider(getRPC());
    super(
      provider || rpcProvider,
      getExchangeProductAddress(),
      getExchangeProductAbi()
    );
    if (!provider) {
      this._contract = new ethers.Contract(
        this._contractAddress,
        this._abis,
        rpcProvider
      );
    }
  }

  createTransaction = async (
    _receiver: string,
    _senderToken: number[],
    _receiverToken: number[]
  ) => {
    const tx = await this._contract.createTransaction(
      _receiver,
      _senderToken,
      _receiverToken,
      this._option
    );
    return this._handleTransactionResponse(tx);
  };

  cancelTransaction = async (_transactionId: number) => {
    const tx = await this._contract.cancelTransaction(
      _transactionId,
      this._option
    );
    return this._handleTransactionResponse(tx);
  };

  acceptTransaction = async (_transactionId: number) => {
    const tx = await this._contract.acceptTransaction(
      _transactionId,
      this._option
    );
    console.log("tx", tx);
    return this._handleTransactionResponse(tx);
  };
}
