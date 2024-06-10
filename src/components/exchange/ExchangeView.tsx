"use client";

import React from "react";
import { Card, CardHeader, Chip, Tab, Tabs, Tooltip } from "@nextui-org/react";
import { IExchange, IUserInfo } from "@/_types_";
import ListUserModal from "@/components/modal/ListUserModal";
import { CgArrowsExchangeAltV, CgArrowsExchangeV } from "react-icons/cg";
import { HiOutlinePlusSm } from "react-icons/hi";
import ExchangeTab from "./ExchangeTab";

interface IExchangeView {
  exchanges?: IExchange[];
  incomingExchanges?: IExchange[];
  users?: IUserInfo[];
}

const ExchangeView: React.FC<IExchangeView> = ({
  exchanges,
  incomingExchanges,
  users,
}) => {
  const [selected, setSelected] = React.useState("exchange");
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  return (
    <>
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
                <CgArrowsExchangeAltV />
                <span>Exchange</span>
                <Chip size="sm" variant="faded">
                  {exchanges?.length}
                </Chip>
              </div>
            }>
            <Card className="px-3">
              <CardHeader className="items-center justify-center uppercase font-bold text-xl">
                Exchange
                <Tooltip
                  color="primary"
                  content={"Create new Exchange"}
                  className="capitalize">
                  <Chip
                    onClick={() => setIsOpen(true)}
                    color="primary"
                    className="ml-3"
                    variant="flat"
                    radius="full">
                    <HiOutlinePlusSm />
                  </Chip>
                </Tooltip>
              </CardHeader>
              <ExchangeTab
                exchanges={exchanges}
                type="exchange"
                onOpen={() => setIsOpen(true)}
              />
            </Card>
          </Tab>
          <Tab
            key="incoming"
            title={
              <div className="flex items-center space-x-2">
                <CgArrowsExchangeV />

                <span>Incoming Exchange</span>
                <Chip size="sm" variant="faded">
                  {incomingExchanges?.length}
                </Chip>
              </div>
            }>
            <Card className="px-3">
              <CardHeader className="items-center justify-center uppercase font-bold text-xl">
                Incoming Exchange
              </CardHeader>
              <ExchangeTab
                exchanges={incomingExchanges}
                onOpen={() => setIsOpen(true)}
                type="incoming-exchange"
              />
            </Card>
          </Tab>
        </Tabs>
      </div>
      <ListUserModal
        users={users}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default ExchangeView;
