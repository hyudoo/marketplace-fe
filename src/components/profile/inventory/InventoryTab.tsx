"use client";

import {
  CardBody,
  cn,
  Pagination,
  PaginationItemRenderProps,
  PaginationItemType,
} from "@nextui-org/react";
import { IoChevronBackOutline, IoChevronForward } from "react-icons/io5";
import { IProductInfo } from "@/_types_";
import InventoryCard from "./InventoryCard";
import React from "react";
interface IInventoryTab {
  products?: IProductInfo[];
  type: "inventory" | "listed" | "auction" | "view";
}

const InventoryTab: React.FC<IInventoryTab> = ({ products, type }) => {
  const [index, setIndex] = React.useState<number>(1);
  const [items, setItems] = React.useState<IProductInfo[]>();
  const total = Math.ceil(products?.length! / 10);
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

  React.useEffect(() => {
    const start = (index - 1) * 10;
    const end = index * 10;
    setItems(products?.slice(start, end));
  }, [index, products]);

  return (
    <CardBody>
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-5">
        {items?.map((product, index) => (
          <InventoryCard
            key={index}
            productId={product.id}
            name={product.name}
            image={product.images[0]}
            price={product.price}
            type={type}
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
  );
};

export default InventoryTab;
