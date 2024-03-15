import { TransactionResponse } from "@ethersproject/abstract-provider";
import { ContractRunner } from "ethers";
import { BigNumberish, ethers, Overrides } from "ethers";

export default class BaseInterface {
  _provider: ethers.JsonRpcProvider | ethers.JsonRpcSigner;
  _contractAddress: string;
  _abis: ethers.InterfaceAbi;
  _contract: ethers.Contract;
  _option: Overrides;

  constructor(
    provider: ethers.JsonRpcProvider | ethers.JsonRpcSigner,
    address: string,
    abi: ethers.InterfaceAbi
  ) {
    this._provider = provider;
    this._contractAddress = address;
    this._abis = abi;
    this._option = { gasLimit: 10000000 };
    this._contract = new ethers.Contract(address, abi, provider);
  }

  _handleTransactionResponse = async (tx: TransactionResponse) => {
    const recept = await tx.wait();
    return recept.transactionHash;
  };

  _numberToEth = (amount: number) => {
    return ethers.parseEther(amount.toString());
  };

  _toNumber = (bigNumber: BigNumberish) => {
    try {
      return bigNumber.toString();
    } catch (er) {
      return Number.parseFloat(ethers.formatEther(bigNumber));
    }
  };

  _toEther = (bigNumber: BigNumberish) => {
    return Number.parseFloat(ethers.formatEther(bigNumber));
  };

  _toWei = (amount: number) => {
    return ethers.parseUnits(amount.toString());
  };
}
