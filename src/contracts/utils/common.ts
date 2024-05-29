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
    97: "0x8265bE7b214346Fd90aD63b224df2dfBb7e0d24f",
    56: "0x8265bE7b214346Fd90aD63b224df2dfBb7e0d24f",
  },
  Product: {
    97: "0x9a65D4947cDE6AB231086aAc7d99055898C73BcC",
    56: "0x9a65D4947cDE6AB231086aAc7d99055898C73BcC",
  },
  CrowdSale: {
    97: "0x004Ffa3dEaC2bF8dA42481a03b271559c2607228",
    56: "0x004Ffa3dEaC2bF8dA42481a03b271559c2607228",
  },
  MarketPlace: {
    97: "0x6568587A7a948bC2aC4928Ed36CAa4E5f83e2e55",
    56: "0x6568587A7a948bC2aC4928Ed36CAa4E5f83e2e55",
  },
  ExchangeProduct: {
    97: "0x190294d8a5Abd1E14C130a4b41A9b2C3b87bCcD0",
    56: "0x190294d8a5Abd1E14C130a4b41A9b2C3b87bCcD0",
  },
  Auction: {
    97: "0x4b8cb96689634299918De4De32aC9A01bd87aA43",
    56: "0x4b8cb96689634299918De4De32aC9A01bd87aA43",
  },
};
