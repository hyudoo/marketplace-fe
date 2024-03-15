export interface IWalletInfo {
  address: string;
  bnb: number;
  mkc: number;
}

export interface IRate {
  bnbRate: number;
}

export interface IPackage {
  key: string;
  name: string;
  amount: number;
}

export interface IMenu {
  name: string;
  url: string;
}

export interface ProductItem {
  id: number;
  name?: string;
  description?: string;
  image: string;
  //Listing
  price?: number;
  seller?: string;
}
