import { ProductItem } from "@/_types_";
import { ethers } from "ethers";
import { getRPC } from "./utils/common";
import { BaseInterface } from "./interfaces";
import { getSupplyChainAbi } from "./utils/getAbis";
import { getSupplyChainAddress } from "./utils/getAddress";
import { BigNumberish } from "ethers";

export default class SupplyChainContract extends BaseInterface {
  constructor(provider?: ethers.JsonRpcSigner) {
    const rpcProvider = new ethers.JsonRpcProvider(getRPC());
    super(
      provider || rpcProvider,
      getSupplyChainAddress(),
      getSupplyChainAbi()
    );
    if (!provider) {
      this._contract = new ethers.Contract(
        this._contractAddress,
        this._abis,
        rpcProvider
      );
    }
  }

  private _listProductIds = async (address: string) => {
    const urls: BigNumberish[] = await this._contract.listProductIds(address);
    const ids = await Promise.all(urls.map((id) => this._toNumber(id)));
    return ids;
  };

  getListProduct = async (address: string): Promise<ProductItem[]> => {
    const ids = await this._listProductIds(address);
    return Promise.all(
      ids.map(async (id) => {
        const productUrl = await this._contract.tokenURI(id);
        const obj = await (await fetch(`${productUrl}.json`)).json();
        const item: ProductItem = { ...obj, id };
        return item;
      })
    );
  };

  getProductInfo = async (products: Array<any>) => {
    return Promise.all(
      products.map(async (o: any) => {
        const productUrl = await this._contract.tokenURI(o.productId);
        const obj = await (await fetch(`${productUrl}.json`)).json();
        const item: ProductItem = {
          ...obj,
          id: o.productId,
          author: o.author,
          price: o.price,
        };
        return item;
      })
    );
  };
}
