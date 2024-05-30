"use client";
import { IProductInfo } from "@/_types_";

import {
  Card,
  CardBody,
  CardHeader,
  cn,
  Input,
  Pagination,
  PaginationItemRenderProps,
  PaginationItemType,
} from "@nextui-org/react";
import React from "react";
import AuctionCard from "./AuctionCard";
import {
  IoChevronBackOutline,
  IoChevronForward,
  IoSearch,
} from "react-icons/io5";
interface IAuctionPlaceProps {
  products: IProductInfo[];
}

const AuctionPlace: React.FC<IAuctionPlaceProps> = ({ products }) => {
  const [index, setIndex] = React.useState<number>(1);
  const [total, setTotal] = React.useState(Math.ceil(products?.length! / 10));
  const [items, setItems] = React.useState<IProductInfo[]>();
  const [filteredList, setFilteredList] =
    React.useState<IProductInfo[]>(products);
  const [search, setSearch] = React.useState<string>("");

  React.useEffect(() => {
    const timeOut = setTimeout(() => {
      if (search?.length > 0) {
        const filteredList = products?.filter((product) =>
          product?.name?.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredList(filteredList);
        setTotal(Math.ceil(filteredList?.length! / 10));
      } else {
        setTotal(Math.ceil(products?.length! / 10));
        setFilteredList(products);
      }
    }, 1500);
    return () => clearTimeout(timeOut);
  }, [search, products]);

  React.useEffect(() => {
    const start = (index - 1) * 10;
    const end = index * 10;
    setItems(filteredList?.slice(start, end));
  }, [index, filteredList]);

  const renderItem = ({
    ref,
    key,
    value,
    isActive,
    onNext,
    onPrevious,
    setPage,
    className,
  }: PaginationItemRenderProps) => {
    if (value === PaginationItemType.NEXT) {
      return (
        <button
          key={key}
          className={cn(className, "bg-default-200/50 min-w-8 w-8 h-8")}
          onClick={onNext}>
          <IoChevronForward />
        </button>
      );
    }

    if (value === PaginationItemType.PREV) {
      return (
        <button
          key={key}
          className={cn(className, "bg-default-200/50 min-w-8 w-8 h-8")}
          onClick={onPrevious}>
          <IoChevronBackOutline />
        </button>
      );
    }

    if (value === PaginationItemType.DOTS) {
      return (
        <button key={key} className={className}>
          ...
        </button>
      );
    }

    // cursor is the default item
    return (
      <button
        key={key}
        ref={ref}
        className={cn(
          className,
          isActive &&
            "text-white bg-gradient-to-br from-indigo-500 to-pink-500 font-bold"
        )}
        onClick={() => setPage(value)}>
        {value}
      </button>
    );
  };

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
        startContent={<IoSearch />}
        type="search"
        value={search}
        onChange={({ target }) => setSearch(target.value)}
      />
      <Card className="mx-3">
        <CardHeader className="items-center justify-center uppercase font-bold text-xl gap-x-1">
          Auctions
        </CardHeader>
        <CardBody>
          <div className="gap-2 grid grid-cols-2 sm:grid-cols-5">
            {items?.map((product, index) => (
              <AuctionCard
                key={index}
                author={product.author}
                lastBidder={product.lastBidder}
                lastBid={product?.lastBid}
                name={product.name}
                image={product.images[0]}
                productId={product.id}
                startTime={product?.startTime}
                endTime={product?.endTime}
              />
            ))}
          </div>
          <div className="w-full flex justify-center mt-4">
            <Pagination
              className="gap-2"
              showControls
              total={total}
              initialPage={1}
              renderItem={renderItem}
              radius="full"
              variant="light"
              onChange={(value) => setIndex(value)}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AuctionPlace;
