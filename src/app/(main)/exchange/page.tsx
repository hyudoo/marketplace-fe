"use client";

import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Tab,
  Tabs,
  Tooltip,
} from "@nextui-org/react";
import ExchangeCard from "@/components/exchange/ExchangeCard";
import { IExchange } from "@/_types_";
import { useAppSelector } from "@/reduxs/hooks";
import ExchangeProductContract from "@/contracts/ExchangeProductContract";
import { useRouter } from "next/navigation";

export default function Exchange() {
  const [selected, setSelected] = React.useState("exchange");
  const { wallet, signer } = useAppSelector((state) => state.account);
  const [isRender, setIsRender] = React.useState<boolean>(true);
  const [exchanges, setExchanges] = React.useState<IExchange[]>([]);
  const [incomingExchanges, setIncomingExchanges] = React.useState<IExchange[]>(
    []
  );
  const router = useRouter();
  const getListExchange = React.useCallback(async () => {
    if (!signer || !wallet || !wallet.address) {
      router.push("/");
    }
    if (!isRender) return;
    const exchangeContract = new ExchangeProductContract(signer);
    try {
      const exchangeIds = await exchangeContract.getTradeBySender(
        wallet?.address!
      );
      const exchanges = await exchangeContract.getTradeByIds(exchangeIds);
      setExchanges(exchanges);
      const ids = await exchangeContract.getTradeByReceiver(wallet?.address!);
      const incomingExchange = await exchangeContract.getTradeByIds(ids);
      setIncomingExchanges(incomingExchange);
    } catch (err) {
      console.log(err);
    } finally {
      setIsRender(false);
    }
  }, [wallet, signer, isRender, router]);

  React.useEffect(() => {
    getListExchange();
  }, [getListExchange]);

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
            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-cyan-600",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-cyan-600",
        }}>
        <Tab
          key="inventory"
          title={
            <div className="flex items-center space-x-2">
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
                  d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                />
              </svg>

              <span>Exchange</span>
              <Chip size="sm" variant="faded">
                {exchanges?.length}
              </Chip>
            </div>
          }>
          <Card>
            <CardHeader className="items-center justify-center uppercase font-bold text-xl">
              Exchange
              <Tooltip
                color="primary"
                content={"Create new Exchange"}
                className="capitalize">
                <svg
                  onClick={() => router.push("/exchange/create")}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </Tooltip>
            </CardHeader>
            <CardBody>
              <div className="gap-2">
                {exchanges?.map((exchange, index) => (
                  <ExchangeCard
                    key={index}
                    address={exchange.sender}
                    exchangeId={exchange.id}
                    yourTokenIds={exchange.senderTokenIds}
                    otherTokenIds={exchange.receiverTokenIds}
                    type="exchange"
                    render={() => setIsRender(true)}
                  />
                ))}
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab
          key="incoming"
          title={
            <div className="flex items-center space-x-2">
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
                  d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25"
                />
              </svg>

              <span>Incoming Exchange</span>
              <Chip size="sm" variant="faded">
                {incomingExchanges?.length}
              </Chip>
            </div>
          }>
          <Card>
            <CardHeader className="items-center justify-center uppercase font-bold text-xl">
              Incoming Exchange
            </CardHeader>
            <CardBody>
              <div className="gap-2">
                {incomingExchanges?.map((exchange, index) => (
                  <ExchangeCard
                    key={index}
                    address={exchange.sender}
                    exchangeId={exchange.id}
                    yourTokenIds={exchange.receiverTokenIds}
                    otherTokenIds={exchange.senderTokenIds}
                    type="incoming-exchange"
                    render={() => setIsRender(true)}
                  />
                ))}
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
