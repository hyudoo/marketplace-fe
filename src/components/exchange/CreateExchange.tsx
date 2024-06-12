"use client";

import React from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  cn,
  Pagination,
  PaginationItemRenderProps,
  PaginationItemType,
} from "@nextui-org/react";
import { IProductInfo, IUserInfo } from "@/_types_";
import { useRouter } from "next/navigation";
import ExchangeItem from "./ExchangeItem";
import { IoChevronBackOutline, IoChevronForward } from "react-icons/io5";
import ExchangeModal from "../modal/ExchangeModal";
import EmptyItem from "./EmptyItem";
interface IExchangeProps {
  other?: IUserInfo;
  yourProducts?: IProductInfo[];
  otherProducts?: IProductInfo[];
}

export default function CreateExchange({
  other,
  yourProducts,
  otherProducts,
}: IExchangeProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [yourIndex, setYourIndex] = React.useState<number>(1);
  const [otherIndex, setOtherIndex] = React.useState<number>(1);
  const [yourItems, setYourItems] = React.useState<IProductInfo[]>();
  const [otherItems, setOtherItems] = React.useState<IProductInfo[]>();
  const [senderProducts, setSenderProducts] = React.useState<IProductInfo[]>(
    []
  );
  const [receiverProducts, setReceiverProducts] = React.useState<
    IProductInfo[]
  >([]);

  const yourTotal = Math.ceil(yourProducts?.length! / 8);
  const otherTotal = Math.ceil(otherProducts?.length! / 8);

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
    const start = (yourIndex - 1) * 8;
    const end = yourIndex * 8;
    setYourItems(yourProducts?.slice(start, end));
  }, [yourIndex, yourProducts]);

  React.useEffect(() => {
    const start = (otherIndex - 1) * 8;
    const end = otherIndex * 8;
    setOtherItems(otherProducts?.slice(start, end));
  }, [otherIndex, otherProducts]);

  const handleClick = async (type: string, product: IProductInfo) => {
    if (type === "sender") {
      const check = senderProducts.includes(product);
      if (check) {
        const id = senderProducts.indexOf(product);
        let newArr = senderProducts;
        newArr.splice(id, 1);
        setSenderProducts([...newArr]);
      } else {
        senderProducts.push(product);
        setSenderProducts([...senderProducts]);
      }
    } else {
      const check = receiverProducts.includes(product);
      if (check) {
        const id = receiverProducts.indexOf(product);
        let newArr = receiverProducts;
        newArr.splice(id, 1);
        setReceiverProducts([...newArr]);
      } else {
        receiverProducts.push(product);
        setReceiverProducts([...receiverProducts]);
      }
    }
  };

  return (
    <>
      <Card className="px-2">
        <div className="flex items-center justify-center p-3">
          <div className="text-gray-600 font-semibold pr-4">
            Create Exchange With:
          </div>
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
        <div className="lg:grid lg:grid-cols-2 flex flex-col gap-2">
          <Card>
            <CardHeader className="items-center justify-center uppercase font-bold text-xl gap-x-1">
              Your Item
            </CardHeader>
            <CardBody>
              {yourTotal == 0 ? (
                <div className="flex min-h-full justify-center items-center">
                  <EmptyItem />
                </div>
              ) : (
                <>
                  <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
                    {yourItems?.map((product, index) => (
                      <ExchangeItem
                        onClick={() => handleClick("sender", product)}
                        key={index}
                        name={product.name}
                        image={product.images[0]}
                        isCheck={senderProducts.includes(product)}
                      />
                    ))}
                  </div>
                  {yourTotal > 1 && (
                    <div className="w-full flex justify-center mt-4">
                      <Pagination
                        className="gap-2"
                        showControls
                        total={yourTotal}
                        initialPage={1}
                        renderItem={renderItem}
                        radius="full"
                        variant="light"
                        onChange={(value) => setYourIndex(value)}
                      />
                    </div>
                  )}
                </>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="items-center justify-center uppercase font-bold text-xl gap-x-1">
              Other Item
            </CardHeader>
            <CardBody>
              {otherTotal == 0 ? (
                <div className="flex min-h-full justify-center items-center">
                  <EmptyItem />
                </div>
              ) : (
                <>
                  <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
                    {otherItems?.map((product, index) => (
                      <ExchangeItem
                        onClick={() => handleClick("receiver", product)}
                        key={index}
                        name={product.name}
                        image={product.images[0]}
                        isCheck={receiverProducts.includes(product)}
                      />
                    ))}
                  </div>
                  {otherTotal > 1 && (
                    <div className="w-full flex justify-center mt-4">
                      <Pagination
                        className="gap-2"
                        showControls
                        total={otherTotal}
                        initialPage={1}
                        renderItem={renderItem}
                        radius="full"
                        variant="light"
                        onChange={(value) => setOtherIndex(value)}
                      />
                    </div>
                  )}
                </>
              )}
            </CardBody>
          </Card>
        </div>
        <div className="text-center mt-3">
          <Button
            className="w-full lg:w-20"
            color="primary"
            onClick={() => setIsOpen(true)}>
            Create
          </Button>
        </div>
      </Card>
      <ExchangeModal
        isOpen={isOpen}
        other={other}
        yourProducts={senderProducts}
        otherProducts={receiverProducts}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
