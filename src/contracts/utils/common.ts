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
    97: "0x647c94dc172411077d0e0c907315674dE3C44680",
    56: "0x647c94dc172411077d0e0c907315674dE3C44680",
  },

  SupplyChain: {
    97: "0x0365742D26652EEF1b7A23B6b4c7990a5A842B97",
    56: "0x0365742D26652EEF1b7A23B6b4c7990a5A842B97",
  },
  CrowdSale: {
    97: "0x7fE6d0BE4e8309E8C4b851Bd84E12fc564a29c37",
    56: "0x7fE6d0BE4e8309E8C4b851Bd84E12fc564a29c37",
  },
  MarketPlace: {
    97: "0x9b329EB44EB4505f888d4e748f87a0A5dEDe46DF",
    56: "0x9b329EB44EB4505f888d4e748f87a0A5dEDe46DF",
  },
  ExchangeProduct: {
    97: "0x6e50111909EF3a9e0Ca9B629DD3B11A42FE26558",
    56: "0x6e50111909EF3a9e0Ca9B629DD3B11A42FE26558",
  },
  Auction: {
    97: "0x499DBfAa23217CC57c2bA459232d756635451f33",
    56: "0x499DBfAa23217CC57c2bA459232d756635451f33",
  },
  Profile: {
    97: "0xb16b8360794D6Fb34E88Ef154915876c97Cff862",
    56: "0xb16b8360794D6Fb34E88Ef154915876c97Cff862",
  },
};
