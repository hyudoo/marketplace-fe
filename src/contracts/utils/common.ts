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
    97: "0x9760914083641A1A3cD4E55c7817157fE17B8385",
    56: "0x9760914083641A1A3cD4E55c7817157fE17B8385",
  },
  MarketPlace: {
    97: "0x764E96A84ce5a574C2883297e97AbFa88D72D68f",
    56: "0x764E96A84ce5a574C2883297e97AbFa88D72D68f",
  },
};
