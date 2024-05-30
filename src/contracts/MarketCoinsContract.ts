import { ethers } from "ethers";
import { Erc20 } from "./interfaces";
import { getMarketCoinsAbi } from "./utils/getAbis";
import { getMarketCoinsAddress } from "./utils/getAddress";

export default class MarketCoinsContract extends Erc20 {
  constructor(provider: ethers.JsonRpcSigner) {
    super(provider, getMarketCoinsAddress(), getMarketCoinsAbi());
  }
}
