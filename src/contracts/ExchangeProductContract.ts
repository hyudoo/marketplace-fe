import { ethers } from "ethers";
import { Erc721 } from "./interfaces";
import { getRPC } from "./utils/common";
import { getExchangeProductAbi } from "./utils/getAbis";
import { getExchangeProductAddress } from "./utils/getAddress";

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

  createExchange = async (
    _receiver: string,
    _senderToken: number[],
    _receiverToken: number[]
  ) => {
    const tx = await this._contract.createExchange(
      _receiver,
      _senderToken,
      _receiverToken,
      this._option
    );
    return this._handleTransactionResponse(tx);
  };

  cancelExchange = async (_transactionId: number) => {
    const tx = await this._contract.cancelExchange(
      _transactionId,
      this._option
    );
    return this._handleTransactionResponse(tx);
  };

  acceptExchange = async (_transactionId: number) => {
    const tx = await this._contract.acceptExchange(
      _transactionId,
      this._option
    );
    return this._handleTransactionResponse(tx);
  };
}
