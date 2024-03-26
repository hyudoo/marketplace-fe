import { IPackage, IProduct, INavbar } from "../_types_";

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

export const navbar: INavbar[] = [
  {
    name: "Market",
    url: "/",
  },
  {
    name: "Manage",
    url: "/manage",
  },
];

export const products: IProduct[] = [
  {
    label: "Men's Fashion",
    value: "Men's Fashion",
  },
  {
    label: "Women's Fashion",
    value: "Women's Fashion",
  },
  {
    label: "Phones & Accessories",
    value: "Phones & Accessories",
  },
  {
    label: "Computers & Laptops",
    value: "Computers & Laptops",
  },
  {
    label: "Women's Accessories & Jewelry",
    value: "Women's Accessories & Jewelry",
  },
  {
    label: "Women's purse",
    value: "Women's purse",
  },
  {
    label: "Men's Shoes",
    value: "Men's Shoes",
  },
  {
    label: "Women's Shoes",
    value: "Women's Shoes",
  },
  {
    label: "Health",
    value: "Health",
  },
  {
    label: "Clock",
    value: "Clock",
  },
];
