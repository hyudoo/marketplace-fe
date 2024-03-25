export type AddressType = {
  97: string;
  56: string;
};

export enum CHAIN_ID {
  TESTNET = 97,
  MAINNET = 56,
}

export default function getChainIdFromEnv(): number {
  const env = process.env.NEXT_PUBLIC_CHAIN_ID;
  if (!env) {
    return 97;
  }
  return parseInt(env);
}

export const getRPC = () => {
  if (getChainIdFromEnv() === CHAIN_ID.MAINNET)
    return process.env.NEXT_PUBLIC_RPC_MAINNET;
  return process.env.NEXT_PUBLIC_RPC_TESTNET;
};

export const SMART_ADDRESS = {
  MarketCoins: {
    97: "0xbff25E68cf50b8dDC6e56Ab36F0B66f6e4820a97",
    56: "0xbff25E68cf50b8dDC6e56Ab36F0B66f6e4820a97",
  },
  CrowdSale: {
    97: "0xd2055F7ecE581c49E9f102e3EdD1907123a9Cdd1",
    56: "0xd2055F7ecE581c49E9f102e3EdD1907123a9Cdd1",
  },
  SupplyChain: {
    97: "0xF05Bd492F2Cce5795e64B1f85aa616424b851aE9",
    56: "0xF05Bd492F2Cce5795e64B1f85aa616424b851aE9",
  },
  MarketPlace: {
    97: "0xa909F3f4eeA178AAa47da0cDa5336f440197Dd52",
    56: "0xa909F3f4eeA178AAa47da0cDa5336f440197Dd52",
  },
};
