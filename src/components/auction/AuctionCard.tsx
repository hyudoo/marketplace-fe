import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Image,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import moment from "moment";
import JoinAuctionModal from "../modal/JoinAuctionModal";
import { IUserInfo } from "@/_types_";
import { useSession } from "next-auth/react";
interface IProductProps {
  author?: IUserInfo;
  lastBid?: number;
  lastBidder?: IUserInfo;
  name?: string;
  image: string;
  productId?: number;
  startTime?: number;
  endTime?: number;
  render?: () => void;
}

export default function AuctionCard({
  author,
  lastBidder,
  lastBid,
  name,
  image,
  startTime,
  endTime,
  productId,
}: IProductProps) {
  const router = useRouter();
  const [isJoinAuction, setIsJoinAuction] = React.useState<boolean>(false);
  const session = useSession();
  const [isDisabled, setDisabled] = React.useState<boolean>(
    !session?.data ||
      author?.id == session?.data?.user?.id ||
      lastBidder?.id == session?.data?.user?.id
  );
  const [canJoin, setCanJoin] = React.useState<boolean>(false);
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
        setCountdown(`Begin in ${remainingTime.humanize()}`);
        setText("Upcoming");
        setCanJoin(true);
      } else if (currentDateTime < endDateTime) {
        const remainingTime = moment.duration(
          endDateTime.diff(currentDateTime)
        );
        setCountdown(`Remaining ${remainingTime.humanize()}`);
        setText("In progress");
        setCanJoin(false);
      } else {
        setCanJoin(true);
        setText("Finished");
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
          {text && (
            <Chip
              className="z-50 hover:cursor-pointer absolute right-1 text-center p-2"
              color="primary"
              variant="flat">
              {text}
            </Chip>
          )}
          <CardBody className="overflow-visible flex flex-col">
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
            {countdown && <div>{countdown}</div>}

            <div className="w-full">{name}</div>
            <div className="text-xs md:text-sm lg:flex lg:justify-between py-3">
              <div className="text-gray-600">Last Bidder:</div>
              <div
                className="flex text-gray-600/75 hover:text-cyan-600 hover:cursor-pointer"
                onClick={() => router.push(`/account/${lastBidder?.id}`)}>
                <Avatar
                  className="mr-2 w-5 h-5"
                  isFocusable
                  isBordered
                  alt="NextUI Fruit Image with Zoom"
                  src={lastBidder?.avatar}
                />
                <div className="hover:border-b-1 border-cyan-800">
                  {lastBidder?.name || "Unnamed"}
                </div>
              </div>
            </div>
            <div className="text-small">Last bid: {lastBid} MKC</div>
            <Button
              onClick={() => setIsJoinAuction(true)}
              variant="flat"
              color="primary"
              type="submit"
              disabled={isDisabled || canJoin}
              className="w-full mt-2">
              Join
            </Button>
          </CardFooter>
        </Card>
      </div>
      <JoinAuctionModal
        isOpen={isJoinAuction}
        onClose={() => setIsJoinAuction(false)}
        id={productId!}
        title={name!}
      />
    </>
  );
}
