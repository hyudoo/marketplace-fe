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
      _receiverToken
    );
    return this._handleTransactionResponse(tx);
  };

  cancelTransaction = async (_transactionId: number) => {
    const tx = await this._contract.cancelTransaction(_transactionId);
    return this._handleTransactionResponse(tx);
  };

  acceptTransaction = async (_transactionId: number) => {
    const tx = await this._contract.acceptTransaction(_transactionId);
    return this._handleTransactionResponse(tx);
  };

  rejectTransaction = async (_transactionId: number) => {
    const tx = await this._contract.rejectTransaction(_transactionId);
    return this._handleTransactionResponse(tx);
  };

  getTradeBySender = async (_sender: string) => {
    const ids: number[] = await this._contract.getTradeBySender(_sender);

    return Promise.all(
      ids.map(async (id: number) => {
        const obj: IExchange = await this._contract.getTradeById(id);
        return { ...obj, id };
      })
    );
  };

  getTradeByReceiver = async (_sender: string) => {
    const ids: number[] = await this._contract.getTradeByReceiver(_sender);

    return Promise.all(
      ids.map(async (id: number) => {
        const obj: IExchange = await this._contract.getTradeById(id);
        return { ...obj, id };
      })
    );
  };

  getTradeById = async (_id: number) => {
    const obj: IExchange = await this._contract.getTradeById(_id);
    return { ...obj, id: _id };
  };
}
