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

export interface IProductInfo {
  id: number;
  name: string;
  type?: string;
  description?: string;
  images: string[];
  //Listing
  price?: number;
  author?: IUserInfo;
  manufacturer?: IUserInfo;

  //Auction
  initialPrice?: number;
  lastBid?: number;
  lastBidder?: IUserInfo;
  startTime?: number;
  endTime?: number;
}

export interface IExchange {
  id?: number;
  other?: IUserInfo;
  yourProducts?: IProductInfo[];
  otherProducts?: IProductInfo[];
}

export interface IProfileInfo {
  address?: string;
  name: string;
  bio: string;
  avatar: string;
  isPublic: boolean;
}

export interface IUserInfo {
  id?: string;
  name?: string;
  wallet?: string;
  banner?: string;
  avatar?: string;
  role?: number;
  createdAt?: Date;
  accessToken?: string;
  status?: number;
  isPublic?: boolean;
}

export interface IUser {
  id: string;
  name: string;
  wallet: string;
  banner: string;
  avatar: string;
  role: number;
  createdAt: Date;
  accessToken: string;
  status: number;
  mkc: number;
  isPublic: boolean;
}
