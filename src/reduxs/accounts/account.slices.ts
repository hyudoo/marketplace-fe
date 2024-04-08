import { IWalletInfo } from "@/_types_";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";

export interface AccountState {
  isUpdate?: boolean;
  wallet?: IWalletInfo;
  signer?: ethers.JsonRpcSigner;
}

const initialState: AccountState = {};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setUpdate: (state, action: PayloadAction<boolean>) => {
      state.isUpdate = action.payload;
    },
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

export const { setWalletInfo, setSigner, clearState, setUpdate } =
  accountSlice.actions;
export default accountSlice.reducer;
