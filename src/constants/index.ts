import { IPackage, IProduct } from "../_types_";

export const packages: IPackage[] = [
  {
    key: "bnb-01",
    name: "BNB PACKAGE 01",
    amount: 100,
  },
  {
    key: "bnb-02",
    name: "BNB PACKAGE 02",
    amount: 200,
  },
  {
    key: "bnb-03",
    name: "BNB PACKAGE 03",
    amount: 300,
  },
  {
    key: "bnb-04",
    name: "BNB PACKAGE 04",
    amount: 500,
  },
];

export const products: IProduct[] = [
  {
    label: "Phones & Accessories",
    value: "Phones & Accessories",
  },
  {
    label: "Computers & Laptops",
    value: "Computers & Laptops",
  },
  {
    label: "Watches",
    value: "Watches",
  },
  {
    label: "Camera Camcorder",
    value: "Camera Camcorder",
  },
];

export const items = [
  { label: "Profile", path: "/profile" },
  { label: "Inventory", path: "/inventory" },
  { label: "Auction", path: "/auction" },
  { label: "Exchange", path: "/exchange" },
  { label: "setting", path: "/setting" },
];

export const ACCESS_TOKEN = "accessToken";
export const REFRESH_TOKEN = "refreshToken";
