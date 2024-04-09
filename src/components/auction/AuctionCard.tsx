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
interface IProductProps {
  author?: string;
  lastBid?: number;
  lastBidder?: string;
  name?: string;
  image: string;
  productId?: number;
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
  productId,
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
      const currentDateTime = moment();
      if (currentDateTime < startDateTime) {
        const remainingTime = moment.duration(
          startDateTime.diff(currentDateTime)
        );
        setCountdown(`Upcoming ${remainingTime.humanize()}`);
        setText("Upcoming");
      } else if (currentDateTime < endDateTime) {
        const remainingTime = moment.duration(
          endDateTime.diff(currentDateTime)
        );
        setCountdown(`Finishes in ${remainingTime.humanize()}`);
        setText("In progress");
      } else {
        setCountdown(`This auction has been finished`);
        setCountdown("Finished");
      }
    };
    const interval = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  return (
    <>
      <div onClick={() => router.push(`product/${productId}`)}>
        <Card shadow="sm">
          <Chip
            className="z-50 hover:cursor-pointer absolute right-1 text-center p-2"
            color="primary"
            variant="flat">
            {text}
          </Chip>
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
          <CardFooter className="text-small block space-y-1">
            <div className="w-full flex justify-center">
              <Chip variant="flat" color="primary">
                {countdown}
              </Chip>
            </div>
            <div className="w-full">{name}</div>
            <div className="lg:grid sm:grid-cols-2">
              <div className="text-small">Last bid: {lastBid} MKC</div>
              <div className="text-small">
                Last bidder: {showSortAddress(lastBidder)}
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={() => setIsJoinAuction(true)}
                variant="flat"
                color="primary"
                type="submit"
                disabled={
                  author == wallet?.address || lastBidder == wallet?.address
                }
                className="w-full md:w-3 md:flex">
                Join
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      <JoinActionModal
        isOpen={isJoinAuction}
        onClose={() => setIsJoinAuction(false)}
        id={productId!}
        title={name!}
        render={onRender!}
      />
    </>
  );
}
