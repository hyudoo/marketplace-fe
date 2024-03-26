import { ethers } from "ethers";
import { Erc721 } from "./interfaces";
import { getRPC } from "./utils/common";
import { getMarketPlaceAbi } from "./utils/getAbis";
import { getMarketPlaceAddress } from "./utils/getAddress";

export default class MarketContract extends Erc721 {
  constructor(provider?: ethers.JsonRpcSigner) {
    const rpcProvider = new ethers.JsonRpcProvider(getRPC());
    super(
      provider || rpcProvider,
      getMarketPlaceAddress(),
      getMarketPlaceAbi()
    );
    if (!provider) {
      this._contract = new ethers.Contract(
        this._contractAddress,
        this._abis,
        rpcProvider
      );
    }
  }

  getProductListedOnMarketPlace = async () => {
    const items = await this._contract.getListedProducts();
    const products = items.map((item: any) => ({
      author: item.author,
      price: this._toEther(item.price),
      productId: item.productId,
    }));
    return products;
  };

  getMyProductListed = async (address: string) => {
    const products = await this.getProductListedOnMarketPlace();
    return products.filter((p: any) => p.author === address);
  };

  listProduct = async (tokenId: number, price: number) => {
    const tx = await this._contract.listProduct(
      tokenId,
      this._numberToEth(price),
      this._option
    );
    return this._handleTransactionResponse(tx);
  };

  unlistProduct = async (tokenId: number) => {
    const tx = await this._contract.unlistProduct(tokenId, this._option);
    return this._handleTransactionResponse(tx);
  };

  buyProduct = async (tokenId: number) => {
    const tx = await this._contract.buyProduct(tokenId, this._option);
    return this._handleTransactionResponse(tx);
  };

  getListedProductByIDs = async (id: number) => {
    const item = await this._contract.getListedProductByID(id);
    return {
      author: item.author,
      price: this._toEther(item.price),
      productId: item.productId,
    };
  };
}
