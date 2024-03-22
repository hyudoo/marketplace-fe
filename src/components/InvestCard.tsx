import React from "react";
import {
  Card,
  CardFooter,
  Image,
  Button,
  CardBody,
  CardHeader,
} from "@nextui-org/react";
import { IPackage, IWalletInfo } from "@/_types_";
import { numberFormat } from "@/utils";

interface IProps {
  pak: IPackage;
  isBuying: boolean;
  rate: number;
  walletInfo?: IWalletInfo;
  onBuy?: () => void;
}
export default function InvestCard({
  pak,
  isBuying,
  rate,
  walletInfo,
  onBuy,
}: IProps) {
  return (
    <Card isFooterBlurred radius="lg" className="border-none w-full">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">Daily Package</p>
        <small className="text-default-500">
          {numberFormat(pak.amount)} MKC
        </small>
        <h4 className="font-bold text-large">Market Coins</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Image
          alt={pak.name}
          shadow="sm"
          radius="lg"
          width="100%"
          className="object-cover w-full h-[280px]"
          src="/bnb-bg.jpeg"
        />
      </CardBody>
      <CardFooter className="object-cover py-2 justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_18px)] shadow-small ml-2 z-10">
        <p className="text-tiny text-white/80">
          {numberFormat(pak.amount / rate)} BNB
        </p>
        <Button
          disabled={!walletInfo?.address || isBuying}
          className="text-tiny text-white bg-black/20"
          variant="flat"
          color="default"
          radius="lg"
          size="sm"
          isLoading={isBuying}
          onClick={onBuy}>
          Buy
        </Button>
      </CardFooter>
    </Card>
  );
}
