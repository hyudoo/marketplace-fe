"use client";

import React from "react";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { usePokemonList } from "./usePokemonList";
import { CldImage } from "next-cloudinary";

export default function App() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { items, hasMore, isLoading, onLoadMore } = usePokemonList({
    fetchDelay: 1500,
  });

  const [, scrollerRef] = useInfiniteScroll({
    hasMore,
    isEnabled: isOpen,
    shouldUseLoader: false, // We don't want to show the loader at the bottom of the list
    onLoadMore,
  });

  return (
    <div>
      <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
        <Input
          variant={"bordered"}
          label="Name"
          isClearable
          isRequired
          placeholder="Enter your product name"
        />
        <Input
          type="number"
          variant={"bordered"}
          label="Prices"
          isRequired
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">MKC</span>
            </div>
          }
        />
      </div>
      <CldImage
        width="600"
        height="600"
        alt="Cloudinary logo"
        src={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}
      />
      <Select
        className="max-w-xs"
        isLoading={isLoading}
        items={items}
        label="Pick type Product"
        placeholder="Select a Product Type"
        scrollRef={scrollerRef}
        selectionMode="single"
        onOpenChange={setIsOpen}>
        {(item) => (
          <SelectItem key={item.name} className="capitalize">
            {item.name}
          </SelectItem>
        )}
      </Select>
    </div>
  );
}
