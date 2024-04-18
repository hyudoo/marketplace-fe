"use client";

import React from "react";
import { Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import SupplyChainContract from "@/contracts/SupplyChainContract";
import AuctionContract from "@/contracts/AuctionContract";
import AuctionCard from "@/components/auction/AuctionCard";
export default function Home() {
  const [listproducts, setListProducts] = React.useState<Array<any>>();
  const [filteredList, setFilteredList] = React.useState<Array<any>>();
  const [search, setSearch] = React.useState<string>("");
  const [isRender, setIsRender] = React.useState<boolean>(false);
  const getListProduct = React.useCallback(async () => {
    const productContract = new SupplyChainContract();
    const auctionContract = new AuctionContract();
    const ids = await auctionContract.getProductListedOnAuction();
    const listproducts = await productContract.getProductsInfo(ids);
    setListProducts(listproducts);
    setFilteredList(listproducts);
  }, []);

  React.useEffect(() => {
    getListProduct();
  }, [getListProduct, isRender]);

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
  }, [search, listproducts]);

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
                productId={product.productId}
                name={product.name}
                image={product.images[0]}
                startTime={product.startTime}
                endTime={product.endTime}
                onRender={() => setIsRender(!isRender)}
              />
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
