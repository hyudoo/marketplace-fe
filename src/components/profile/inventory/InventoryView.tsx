"use client";

import React from "react";
import { Card, CardHeader, Chip, Tab, Tabs } from "@nextui-org/react";
import { IProductInfo } from "@/_types_";
import InventoryTab from "./InventoryTab";
import { IoCartOutline } from "react-icons/io5";
import { MdOutlineInventory2 } from "react-icons/md";
import { RiAuctionLine } from "react-icons/ri";
interface IInventory {
  inventory?: IProductInfo[];
  listedProducts?: IProductInfo[];
  auctionProducts?: IProductInfo[];
}

const InventoryView: React.FC<IInventory> = ({
  inventory,
  listedProducts,
  auctionProducts,
}) => {
  const [selected, setSelected] = React.useState("inventory");
  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        selectedKey={selected}
        onSelectionChange={(key) => setSelected(key as string)}
        color="primary"
        variant="underlined"
        classNames={{
          tabList:
            "gap-6 w-full justify-center relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-cyan-600",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-cyan-600",
        }}>
        <Tab
          key="inventory"
          title={
            <div className="flex items-center space-x-2">
              <MdOutlineInventory2 />
              <span>Inventory</span>
              <Chip size="sm" variant="faded">
                {inventory?.length || 0}
              </Chip>
            </div>
          }>
          <Card className="mx-3">
            <CardHeader className="items-center justify-center uppercase font-bold text-xl gap-x-1">
              Inventory
            </CardHeader>
            <InventoryTab products={inventory} type="inventory" />
          </Card>
        </Tab>
        <Tab
          key="listed"
          title={
            <div className="flex items-center space-x-2">
              <IoCartOutline />
              <span>Listed</span>
              <Chip size="sm" variant="faded">
                {listedProducts?.length || 0}
              </Chip>
            </div>
          }>
          <Card className="mx-3">
            <CardHeader className="items-center justify-center uppercase font-bold text-xl gap-x-1">
              YOUR LISTED PRODUCTS
            </CardHeader>
            <InventoryTab products={listedProducts} type="listed" />
          </Card>
        </Tab>
        <Tab
          key="auction"
          title={
            <div className="flex items-center space-x-2">
              <RiAuctionLine />
              <span>Auctions</span>
              <Chip size="sm" variant="faded">
                {auctionProducts?.length || 0}
              </Chip>
            </div>
          }>
          <Card className="mx-3">
            <CardHeader className="items-center justify-center uppercase font-bold text-xl gap-x-1">
              YOUR AUCTIONS PRODUCTS
            </CardHeader>
            <InventoryTab products={auctionProducts} type="auction" />
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default InventoryView;
