import getChainIdFromEnv, { AddressType, SMART_ADDRESS } from "./common";

const getAddress = (address: AddressType) => {
  const CHAIN_ID = getChainIdFromEnv() as keyof AddressType;
  return address[CHAIN_ID];
};
export const getMarketCoinsAddress = () =>
  getAddress(SMART_ADDRESS.MarketCoins);

export const getCrowdSaleAddress = () => getAddress(SMART_ADDRESS.CrowdSale);

export const getSupplyChainAddress = () =>
  getAddress(SMART_ADDRESS.SupplyChain);

export const getMarketPlaceAddress = () =>
  getAddress(SMART_ADDRESS.MarketPlace);
