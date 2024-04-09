import React from "react";
import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import ListProductModal from "../modal/ListProductModal";
import UnlistProductModal from "../modal/UnlistProductModal";
import CreateAuctionModal from "../modal/CreateAuctionModal";
import CancelAuctionModal from "../modal/CancelAuctionModal";
import FinishAuctionModal from "../modal/FinishAuctionModal";
import BuyProductModal from "../modal/BuyProductModal";
import { useAppSelector } from "@/reduxs/hooks";
interface IProductProps {
  name?: string;
  author?: string;
  image: string;
  price?: number | string;
  productId?: number;
  isDone?: boolean;
  type?: "inventory" | "listed" | "unlist" | "auction";
  isCheck?: boolean;
  render?: () => void;
  onClick?: () => void;
}

export default function ProductCard({
  name,
  author,
  image,
  price,
  productId,
  type,
  isDone,
  isCheck,
  render,
  onClick,
}: IProductProps) {
  const router = useRouter();
  const [isListOpen, setIsListOpen] = React.useState<boolean>(false);
  const [isCreateAuction, setIsCreateAuction] = React.useState<boolean>(false);
  const [isUnlistOpen, setIsUnlistOpen] = React.useState<boolean>(false);
  const [isCancelAuction, setIsCancelAuction] = React.useState<boolean>(false);
  const [isFinishAuction, setIsFinishAuction] = React.useState<boolean>(false);
  const [isBuyOpen, setIsBuyOpen] = React.useState<boolean>(false);
  const { wallet } = useAppSelector((state) => state.account);

  return (
    <>
      <div
        onClick={
          onClick ? onClick : () => router.push(`/product/${productId}`)
        }>
        <Card
          shadow="sm"
          className={isCheck ? "border-1 border-sky-700 h-full" : "h-full"}>
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

            {type == "auction" ? (
              <div>
                <p className="text-default-500 flex items-center">
                  Price: {price} MKC
                </p>
                <div className="justify-between lg:justify-end flex gap-2">
                  <Button
                    onClick={() => setIsFinishAuction(true)}
                    variant="flat"
                    color="success"
                    disabled={!isDone}
                    className="p-2 m-0">
                    Finnish
                  </Button>
                  <Button
                    onClick={() => setIsCancelAuction(true)}
                    variant="flat"
                    color="primary"
                    className="p-2 m-0">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {type == "inventory" ? (
                  <div className="justify-between lg:justify-end flex gap-2">
                    <Button
                      onClick={() => setIsCreateAuction(true)}
                      variant="flat"
                      color="primary"
                      className="p-2 m-0">
                      Auction
                    </Button>
                    <Button
                      onClick={() => setIsListOpen(true)}
                      variant="flat"
                      color="primary"
                      className="p-2 m-0">
                      List
                    </Button>
                  </div>
                ) : (
                  <div className="justify-between flex">
                    <p className="text-default-500 flex items-center">
                      Price: {price} MKC
                    </p>
                    {type == "listed" && (
                      <Button
                        variant="flat"
                        color="primary"
                        className="p-2 m-0"
                        disabled={!wallet || author == wallet?.address}
                        onClick={() => setIsBuyOpen(true)}>
                        Buy
                      </Button>
                    )}

                    {type == "unlist" && (
                      <Button
                        onClick={() => setIsUnlistOpen(true)}
                        variant="flat"
                        color="primary"
                        className="p-2 m-0">
                        Unlist
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </CardFooter>
        </Card>
      </div>

      <ListProductModal
        isOpen={isListOpen}
        id={productId!}
        title={name!}
        render={render!}
        onClose={() => setIsListOpen(false)}
      />

      <CreateAuctionModal
        isOpen={isCreateAuction}
        id={productId!}
        title={name!}
        render={render!}
        onClose={() => setIsCreateAuction(false)}
      />

      <UnlistProductModal
        isOpen={isUnlistOpen}
        id={productId!}
        title={name!}
        render={render!}
        onClose={() => setIsUnlistOpen(false)}
      />

      <CancelAuctionModal
        isOpen={isCancelAuction}
        id={productId!}
        render={render!}
        onClose={() => setIsCancelAuction(false)}
      />

      <BuyProductModal
        isOpen={isBuyOpen}
        title={name!}
        productId={productId!}
        render={render!}
        productPrice={price as number}
        onClose={() => setIsBuyOpen(false)}
      />

      <FinishAuctionModal
        isOpen={isFinishAuction}
        id={productId!}
        render={render!}
        onClose={() => setIsFinishAuction(false)}
      />
    </>
  );
}
