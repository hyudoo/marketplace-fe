import React from "react";
import {
  Avatar,
  Button,
  Card,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import { IProductInfo, IProfileInfo, IUserInfo } from "@/_types_";
import AcceptExchangeModal from "../modal/AcceptExchangeModal";
import CancelExchangeModal from "../modal/CancelExchangeModal";
import { useRouter } from "next/navigation";
import ExchangeCardBody from "./ExchangeCardBody";
interface IExchangeProps {
  exchangeId?: number;
  other?: IUserInfo;
  yourProducts?: IProductInfo[];
  otherProducts?: IProductInfo[];
  type?: "exchange" | "incoming-exchange";
}

export default function ExchangeCard({
  exchangeId,
  other,
  yourProducts,
  otherProducts,
  type,
}: IExchangeProps) {
  const [isOpenAcceptModal, setIsOpenAcceptModal] =
    React.useState<boolean>(false);
  const [isOpenDeclineModal, setIsOpenDeclineModal] =
    React.useState<boolean>(false);
  const router = useRouter();
  return (
    <>
      <Card className="px-2">
        <div className="flex items-center justify-center p-3">
          <div className="text-gray-600 font-semibold pr-4">Exchange with:</div>
          <div
            className="col-span-2 flex items-center text-gray-600/75 hover:text-cyan-600 hover:cursor-pointer"
            onClick={() => router.push(`/account/${other?.id}`)}>
            <Avatar
              className="mr-3"
              isFocusable
              size="sm"
              isBordered
              alt="NextUI Fruit Image with Zoom"
              src={other?.avatar}
            />
            <div className="hover:border-b-1 items-center border-cyan-800">
              {other?.name || "Unnamed"}
            </div>
          </div>
        </div>
        <div className="md:grid md:grid-cols-2 flex flex-col gap-2">
          <Card>
            <CardHeader className="items-center justify-center uppercase font-bold text-xl gap-x-1">
              Your Item
            </CardHeader>
            <ExchangeCardBody products={yourProducts} />
          </Card>

          <Card>
            <CardHeader className="items-center justify-center uppercase font-bold text-xl gap-x-1">
              Other Item
            </CardHeader>
            <ExchangeCardBody products={otherProducts} />
          </Card>
        </div>
        <CardFooter className="justify-end gap-x-2">
          {type == "incoming-exchange" && (
            <Button onClick={() => setIsOpenAcceptModal(true)} color="primary">
              Accept
            </Button>
          )}

          <Button onClick={() => setIsOpenDeclineModal(true)}>Cancel</Button>
        </CardFooter>
      </Card>
      <AcceptExchangeModal
        isOpen={isOpenAcceptModal}
        id={exchangeId!}
        products={yourProducts!}
        onClose={() => setIsOpenAcceptModal(false)}
      />
      <CancelExchangeModal
        isOpen={isOpenDeclineModal}
        id={exchangeId!}
        onClose={() => setIsOpenDeclineModal(false)}
      />
    </>
  );
}
