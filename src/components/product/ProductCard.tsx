import React from "react";
import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import ListProductModal from "../modal/ListProductModal";
import UnlistProductModal from "../modal/UnlistProductModal";
import CreateAuctionModal from "../modal/CreateAuctionModal";
import CancelAuctionModal from "../modal/CancelAuctionModal";
interface IProductProps {
  name?: string;
  image: string;
  price?: number | string;
  productId?: number;
  auctionId?: number;
  type?: "inventory" | "listed" | "unlist" | "auction";
  isCheck?: boolean;
  render?: () => void;
  onClick?: () => void;
}

export default function ProductCard({
  name,
  image,
  price,
  productId,
  auctionId,
  type,
  isCheck,
  render,
  onClick,
}: IProductProps) {
  const router = useRouter();
  const [isListOpen, setIsListOpen] = React.useState<boolean>(false);
  const [isCreateAuction, setIsCreateAuction] = React.useState<boolean>(false);
  const [isUnlistOpen, setIsUnlistOpen] = React.useState<boolean>(false);
  const [isCancelAuction, setIsCancelAuction] = React.useState<boolean>(false);

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
                    onClick={() => router.push(`/product/${productId}`)}>
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

                {type == "auction" && (
                  <Button
                    onClick={() => setIsCancelAuction(true)}
                    variant="flat"
                    color="primary"
                    className="p-2 m-0">
                    Cancel
                  </Button>
                )}
              </div>
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
        id={auctionId!}
        render={render!}
        onClose={() => setIsCancelAuction(false)}
      />
    </>
  );
}
