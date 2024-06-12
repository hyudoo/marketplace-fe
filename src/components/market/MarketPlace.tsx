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
import MarketItem from "./MarketItem";
import {
  IoChevronBackOutline,
  IoChevronForward,
  IoSearch,
} from "react-icons/io5";
import EmptyState from "../EmptyState";
interface IMarketPlaceProps {
  products: IProductInfo[];
}

const MarketPlace: React.FC<IMarketPlaceProps> = ({ products }) => {
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
      <div className="m-3 flex justify-center">
        <div className="w-full lg:w-[440px] lg:w-[880px] rounded-2xl flex justify-center items-center bg-white ">
          <Input
            classNames={{
              label: "text-black/50 dark:text-white/90",
              input: [
                "bg-transparent",
                "text-black/90 dark:text-white/90",
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
              innerWrapper: "bg-transparent",
              inputWrapper: [
                "shadow-xl",
                "bg-default-200/50",
                "dark:bg-default/60",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
                "hover:bg-default-200/70",
                "dark:hover:bg-default/70",
                "group-data-[focus=true]:bg-default-200/50",
                "dark:group-data-[focus=true]:bg-default/60",
                "!cursor-text",
              ],
            }}
            placeholder="Type to search..."
            size="sm"
            startContent={<IoSearch />}
            type="search"
            value={search}
            onChange={({ target }) => setSearch(target.value)}
          />
        </div>
      </div>
      <Card className="mx-3">
        <CardHeader className="items-center justify-center uppercase font-bold text-xl gap-x-1">
          Market Place
        </CardHeader>
        <CardBody>
          {items?.length === 0 ? (
            <div className="min-h-[700px] flex justify-center items-center">
              <EmptyState />
            </div>
          ) : (
            <>
              <div className="gap-2 grid grid-cols-2 lg:grid-cols-5">
                {items?.map((product, index) => (
                  <MarketItem
                    key={index}
                    authorId={product.author?.id}
                    authorName={product.author?.name}
                    authorImage={product.author?.avatar}
                    name={product.name}
                    image={product.images[0]}
                    price={product.price}
                    productId={product.id}
                  />
                ))}
              </div>
              {total > 1 && (
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
              )}
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default MarketPlace;
