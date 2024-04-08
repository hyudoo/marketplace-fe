"use client";

import React from "react";
import { Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { IProductItem } from "@/_types_";
import SupplyChainContract from "@/contracts/SupplyChainContract";
import AuctionContract from "@/contracts/AuctionContract";
import AuctionCard from "@/components/auction/AuctionCard";
export default function Home() {
  const [listproducts, setListProducts] = React.useState<Array<any>>();
  const [filteredList, setFilteredList] = React.useState<Array<any>>();
  const [search, setSearch] = React.useState<string>("");
  const getListProduct = React.useCallback(async () => {
    try {
      const productContract = new SupplyChainContract();
      const auctionContract = new AuctionContract();
      const ids = await auctionContract.getAuctionByStatus();
      const listproducts = await productContract.getProductsInfo(ids);
      console.log("listproducts", listproducts);
      setListProducts(listproducts);
      setFilteredList(listproducts);
    } catch (err) {
      console.log(err);
    }
  }, []);

  React.useEffect(() => {
    getListProduct();
  }, [getListProduct]);

  React.useEffect(() => {
    if (!listproducts) return;
    const timeOut = setTimeout(() => {
      if (search?.length) {
        if (!listproducts) return;
        const filteredList = listproducts?.filter((product) =>
          product?.name?.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredList(filteredList);
      } else {
        setFilteredList(listproducts);
      }
    }, 1500);
    return () => clearTimeout(timeOut);
  }, [search]);

  return (
    <div className="flex w-full flex-col">
      <Input
        classNames={{
          base: "max-w-full h-10",
          mainWrapper: "h-full",
          input: "text-small",
          inputWrapper:
            "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
        }}
        placeholder="Type to search..."
        size="sm"
        startContent={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        }
        type="search"
        value={search}
        onChange={({ target }) => setSearch(target.value)}
      />
      <Card>
        <CardHeader className="items-center justify-center uppercase font-bold text-xl gap-x-1">
          Market Place
        </CardHeader>
        <CardBody>
          <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
            {filteredList?.map((product, index) => (
              <AuctionCard
                author={product.author}
                lastBid={product.lastBid}
                lastBidder={product.lastBidder}
                key={index}
                auctionId={product.id}
                name={product.name}
                image={product.images[0]}
                price={product.initialPrice}
                startTime={product.startTime}
                endTime={product.endTime}
              />
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
