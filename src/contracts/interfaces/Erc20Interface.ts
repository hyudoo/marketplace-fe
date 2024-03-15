import { ethers } from "ethers";
import BaseInterface from "./BaseInterface";

class Erc20 extends BaseInterface {
  constructor(
    provider: ethers.JsonRpcSigner,
    address: string,
    abi: ethers.InterfaceAbi
  ) {
    super(provider, address, abi);
  }

  async balanceOf(walletAddress: string): Promise<number> {
    const balance = await this._contract.balanceOf(walletAddress);
    return this._toNumber(balance) as number;
  }

  async owner(): Promise<string> {
    return this._contract.owner();
  }

  async totalSupply(): Promise<number> {
    const total = await this._contract.totalSupply();
    return this._toNumber(total) as number;
  }

  async name(): Promise<string> {
    return this._contract.name();
  }

  async symbol(): Promise<string> {
    return this._contract.symbol();
  }

  async approve(address: string, amount: number) {
    const wei = ethers.parseUnits(amount.toString());
    await this._contract.approve(address, wei, this._option);
  }
}

export default Erc20;
