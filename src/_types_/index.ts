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

export interface INavbar {
  name: string;
  url: string;
}

export interface IProductItem {
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

export interface IExchange {
  id?: number;
  sender?: string;
  receiver?: string;
  senderTokenIds?: number[];
  receiverTokenIds?: number[];
  active?: boolean;
}

export interface IProfileInfo {
  address?: string;
  name: string;
  bio: string;
  avatar: string;
  isPublic: boolean;
}

export interface IAuctionInfo {
  author: string;
  productId: number | string;
  initialPrice: number;
  lastBid: number;
  lastBidder: string;
  startTime: number;
  endTime: number;
}
