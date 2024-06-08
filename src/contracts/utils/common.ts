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
    97: "0xaEa826728197bBC0AC64432d72C45B0bacf3A35f",
    56: "0xaEa826728197bBC0AC64432d72C45B0bacf3A35f",
  },
  Product: {
    97: "0x459Bb3034Fcd4A68cFDA424a46F9a778f6C683dA",
    56: "0x459Bb3034Fcd4A68cFDA424a46F9a778f6C683dA",
  },
  CrowdSale: {
    97: "0x65873AB3b7a645c50a95F3590C1ADDa856bd194d",
    56: "0x65873AB3b7a645c50a95F3590C1ADDa856bd194d",
  },
  MarketPlace: {
    97: "0x6C4fe5972bc0a6C97f32Ab9024B77E5Aaab36fD7",
    56: "0x6C4fe5972bc0a6C97f32Ab9024B77E5Aaab36fD7",
  },
  ExchangeProduct: {
    97: "0x673f2C9d85EB83EEC262A4508b150604E7ac539b",
    56: "0x673f2C9d85EB83EEC262A4508b150604E7ac539b",
  },
  Auction: {
    97: "0x0D0e030662D63EcB722938dEC990Ba7c206da71c",
    56: "0x0D0e030662D63EcB722938dEC990Ba7c206da71c",
  },
};
