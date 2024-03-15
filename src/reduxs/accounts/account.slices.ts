import { IWalletInfo } from "@/_types_";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";

export interface AccountState {
  wallet?: IWalletInfo;
  signer?: ethers.JsonRpcSigner;
}

const initialState: AccountState = {};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setSigner: (state, action: PayloadAction<ethers.JsonRpcSigner>) => {
      state.signer = action.payload;
    },
    setWalletInfo: (state, action: PayloadAction<IWalletInfo>) => {
      state.wallet = action.payload;
    },
    clearState: (state) => {
      state.signer = undefined;
      state.wallet = undefined;
    },
  },
});

export const { setWalletInfo, setSigner, clearState } = accountSlice.actions;
export default accountSlice.reducer;
