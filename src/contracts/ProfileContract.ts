import { ethers } from "ethers";
import { getProfileAbi } from "./utils/getAbis";
import { getProfileAddress } from "./utils/getAddress";
import { BaseInterface } from "./interfaces";
import { IProfileInfo } from "@/_types_";
import { getRPC } from "./utils/common";

export default class ProfileContract extends BaseInterface {
  constructor(provider?: ethers.JsonRpcSigner) {
    const rpcProvider = new ethers.JsonRpcProvider(getRPC());
    super(provider || rpcProvider, getProfileAddress(), getProfileAbi());
    if (!provider) {
      this._contract = new ethers.Contract(
        this._contractAddress,
        this._abis,
        rpcProvider
      );
    }
  }

  createProfile = async (name: string, bio: string, avatar: string) => {
    const tx = await this._contract.createProfile(
      name,
      bio,
      avatar,
      this._option
    );
    return this._handleTransactionResponse(tx);
  };

  getProfileByAddress = async (address: string) => {
    const rs = await this._contract.getProfileByAddress(address);
    const item: IProfileInfo = {
      name: rs[0],
      bio: rs[1],
      avatar: rs[2],
      isPublic: rs[3],
      address: address,
    };
    return item;
  };

  updateProfile = async (
    name: string,
    bio: string,
    avatar: string,
    isPublic: boolean
  ) => {
    const tx = await this._contract.updateProfile(
      name,
      bio,
      avatar,
      isPublic,
      this._option
    );
    return this._handleTransactionResponse(tx);
  };

  getAllProfile = async (address: string) => {
    const rs = await this._contract.getAllUser();
    const results: IProfileInfo[] = [];
    for (let i = 0; i < rs.length; i++) {
      if (rs[i] == address) continue;
      const o: IProfileInfo = await this.getProfileByAddress(rs[i]);
      if (!o?.isPublic) continue;
      const item: IProfileInfo = {
        name: o?.name,
        bio: o?.bio,
        avatar: o?.avatar,
        isPublic: o?.isPublic,
        address: rs[i],
      };
      results.push(item);
    }
    return results;
  };
}
