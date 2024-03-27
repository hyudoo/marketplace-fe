import { ethers } from "ethers";
import { Erc721 } from "./interfaces";
import { getRPC } from "./utils/common";
import { getProductTransactionAbi } from "./utils/getAbis";
import { getProductTransactionAddress } from "./utils/getAddress";
import { ITransaction } from "@/_types_";

export default class ProductTransactionContract extends Erc721 {
  constructor(provider?: ethers.JsonRpcSigner) {
    const rpcProvider = new ethers.JsonRpcProvider(getRPC());
    super(
      provider || rpcProvider,
      getProductTransactionAddress(),
      getProductTransactionAbi()
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
    const obj: ITransaction[] = await this._contract.getTradeBySender(_sender);
    return obj;
  };

  getTradeByReceiver = async (_sender: string) => {
    const obj: ITransaction[] = await this._contract.getTradeByReceiver(
      _sender
    );
    return obj;
  };
}
