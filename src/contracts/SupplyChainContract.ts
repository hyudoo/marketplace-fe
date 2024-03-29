import { TransactionResponse } from "@ethersproject/abstract-provider";
import { IProductItem } from "@/_types_";
import { ethers, keccak256 } from "ethers";
import { getRPC } from "./utils/common";
import { Erc721 } from "./interfaces";
import { getSupplyChainAbi } from "./utils/getAbis";
import { getSupplyChainAddress } from "./utils/getAddress";
import { BigNumberish } from "ethers";

export default class SupplyChainContract extends Erc721 {
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

  addProduct = async (data: any) => {
    const tx: TransactionResponse = await this._contract.mint(
      data.address,
      data.cid,
      data.type
    );
    return this._handleTransactionResponse(tx);
  };

  getListProduct = async (address: string): Promise<IProductItem[]> => {
    const ids = await this._listProductIds(address);
    return Promise.all(
      ids.map(async (id) => {
        const productUrl = await this._contract.getProductURI(id);
        const obj = await (await fetch(`${productUrl}`)).json();
        obj.images = obj.images.split(",");
        const item: IProductItem = { ...obj, id };
        return item;
      })
    );
  };

  getProductInfoById = async (productId: number) => {
    const productUrl = await this._contract.getProductURI(productId);
    const obj = await (await fetch(`${productUrl}`)).json();
    obj.images = obj.images.split(",");
    const transitHistory = await this._contract.getTransitHistory(productId);
    const product: IProductItem = {
      ...obj,
      id: productId,
      author: transitHistory[transitHistory.length - 1],
      manufacturer: transitHistory[0],
    };
    return product;
  };

  getProductInfoByIds = async (productIds: number[]) => {
    return Promise.all(
      productIds.map(async (id) => {
        return this.getProductInfoById(id);
      })
    );
  };

  getProductsInfo = async (products: Array<any>) => {
    return Promise.all(
      products.map(async (product) => {
        const obj = await this.getProductInfoById(product?.productId);
        return {
          ...obj,
          price: product.price,
        };
      })
    );
  };

  getTransitHistory = async (productId: number) => {
    return this._contract.getTransitHistory(productId);
  };

  hasMinterRole = async (address: string) => {
    return this._contract.hasMinterRole(address);
  };
}
