import { IExchange } from "@/_types_";
import {
  CardBody,
  cn,
  Pagination,
  PaginationItemRenderProps,
  PaginationItemType,
} from "@nextui-org/react";
import { IoChevronBackOutline, IoChevronForward } from "react-icons/io5";
import ExchangeCard from "./ExchangeCard";
import React from "react";
import EmptyExchange from "./EmptyExchange";

interface IExchangeTab {
  exchanges?: IExchange[];
  type: "exchange" | "incoming-exchange";
  onOpen: () => void;
}

const ExchangeTab: React.FC<IExchangeTab> = ({ exchanges, type, onOpen }) => {
  const [index, setIndex] = React.useState<number>(1);
  const [items, setItems] = React.useState<IExchange[]>();
  const total = Math.ceil(exchanges?.length! / 5);

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
    const start = (index - 1) * 5;
    const end = index * 5;
    setItems(exchanges?.slice(start, end));
  }, [index, exchanges]);

  return (
    <CardBody>
      {total === 0 ? (
        <div className="min-h-[700px] flex justify-center items-center">
          <EmptyExchange onOpen={onOpen} />
        </div>
      ) : (
        <>
          <div className="gap-2">
            {items?.map((exchange, index) => (
              <ExchangeCard
                key={index}
                exchangeId={exchange?.id}
                other={exchange?.other}
                yourProducts={exchange?.yourProducts}
                otherProducts={exchange?.otherProducts}
                type={type}
              />
            ))}
          </div>
          {total > 1 && (
            <div className="w-full flex justify-center mt-4">
              <Pagination
                className="gap-2"
                showControls
                total={total}
                initialPage={1}
                renderItem={renderItem}
                radius="full"
                variant="light"
                onChange={(value) => setIndex(value)}
              />
            </div>
          )}
        </>
      )}
    </CardBody>
  );
};
export default ExchangeTab;
