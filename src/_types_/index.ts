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

export interface IProduct {
  label: string;
  value: string;
}

export interface IMenu {
  name: string;
  url: string;
}

export interface ProductItem {
  id: number;
  name?: string;
  type?: string;
  description?: string;
  images: string[];
  //Listing
  price?: number;
  author?: string;
  manufacturer?: string;
}
