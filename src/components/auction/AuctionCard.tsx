import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Image,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import moment from "moment";
import JoinActionModal from "../modal/JoinActionModal";
import { useAppSelector } from "@/reduxs/hooks";
import { showSortAddress } from "@/utils";
import { FooterAuction } from "./FooterAution";
interface IProductProps {
  author?: string;
  lastBid?: number;
  lastBidder?: string;
  name?: string;
  image: string;
  price?: number | string;
  auctionId?: number;
  startTime: number;
  endTime: number;
  render?: () => void;
  onRender?: () => void;
}

export default function AuctionCard({
  author,
  lastBid,
  lastBidder,
  name,
  image,
  startTime,
  endTime,
  price,
  auctionId,
  onRender,
}: IProductProps) {
  const router = useRouter();
  const [isJoinAuction, setIsJoinAuction] = React.useState<boolean>(false);
  const { wallet, signer } = useAppSelector((state) => state.account);

  const [text, setText] = useState<string>("");
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    const startDateTime = moment(startTime);
    const endDateTime = moment(endTime);
    const updateCountdown = () => {
      const currentDateTime = moment(); // Thời gian hiện tại
      if (currentDateTime < startDateTime) {
        const remainingTime = moment.duration(
          startDateTime.diff(currentDateTime)
        );
        setCountdown(remainingTime.humanize());
        setText("Upcoming");
      } else if (currentDateTime < endDateTime) {
        const remainingTime = moment.duration(
          endDateTime.diff(currentDateTime)
        );
        setCountdown(remainingTime.humanize());
        setText("In progress");
      } else {
        setCountdown("Finnished");
      }
    };
    const interval = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div>
        <Card shadow="sm">
          <Chip
            className="z-50 hover:cursor-pointer absolute right-1 text-center p-2"
            startContent={<div>{text}</div>}
            color="primary"
            variant="flat"
          />
          <CardBody className="overflow-visible p-0 flex flex-col">
            <Image
              shadow="sm"
              radius="lg"
              width="100%"
              alt={name}
              className="object-fill cursor-pointer hover:scale-110 transition translate aspect-square"
              src={image}
            />
          </CardBody>
          <CardFooter className="text-small block">
            <div className="w-full">{name}</div>
            <div className="text-small">Last bid: {lastBid} MKC</div>
            <div className="text-small">
              Last bidder: {showSortAddress(lastBidder)}
            </div>
            <FooterAuction startTime={startTime} endTime={endTime} />
            <Button
              onClick={() => setIsJoinAuction(true)}
              variant="flat"
              color="primary"
              disabled={
                author == wallet?.address || lastBidder == wallet?.address
              }
              className="p-2 m-0">
              Join
            </Button>
          </CardFooter>
        </Card>
      </div>
      <JoinActionModal
        isOpen={isJoinAuction}
        onClose={() => setIsJoinAuction(false)}
        id={auctionId!}
        title={name!}
        render={onRender!}
      />
    </>
  );
}
