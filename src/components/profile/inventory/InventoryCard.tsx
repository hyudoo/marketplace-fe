import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Image,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import ListProductModal from "@/components/modal/ListProductModal";
import UnlistProductModal from "@/components/modal/UnlistProductModal";
import CreateAuctionModal from "@/components/modal/CreateAuctionModal";
import CancelAuctionModal from "@/components/modal/CancelAuctionModal";
import FinishAuctionModal from "@/components/modal/FinishAuctionModal";
import { IProductInfo } from "@/_types_";
import UpdatePriceProductModal from "@/components/modal/UpdatePriceModal";
interface IInventoryCardProps {
  product: IProductInfo;
  type?: "inventory" | "listed" | "auction" | "view";
}

export default function InventoryCard({ product, type }: IInventoryCardProps) {
  const router = useRouter();
  const [isListOpen, setIsListOpen] = React.useState<boolean>(false);
  const [isCreateAuction, setIsCreateAuction] = React.useState<boolean>(false);
  const [isUnlistOpen, setIsUnlistOpen] = React.useState<boolean>(false);
  const [isCancelAuction, setIsCancelAuction] = React.useState<boolean>(false);
  const [isFinishAuction, setIsFinishAuction] = React.useState<boolean>(false);
  const [isUpdate, setIsUpdate] = React.useState<boolean>(false);
  return (
    <>
      <div onClick={() => router.push(`/product/${product?.id}`)}>
        <Card shadow="sm" className="h-full">
          <Chip
            className="z-50 hover:cursor-pointer absolute left-1 top-1 text-center p-1 text-xs lg:text-sm"
            color="primary"
            variant="flat">
            ID: {product.id}
          </Chip>
          <CardBody className="overflow-visible flex flex-col">
            <Image
              shadow="sm"
              radius="lg"
              width="100%"
              alt={product?.name}
              className="object-fill cursor-pointer hover:scale-110 transition translate aspect-square"
              src={product?.images[0]}
            />
          </CardBody>
          <CardFooter className="text-small block space-y-2">
            <div className="w-full">{product?.name}</div>

            {type == "auction" ? (
              <div>
                <p className="text-default-500">
                  Price: {product?.lastBid} MKC
                </p>
                <div className="lg:justify-between lg:flex gap-x-3">
                  <Button
                    onClick={() => setIsFinishAuction(true)}
                    variant="flat"
                    color="success"
                    className="w-full my-2">
                    Finish
                  </Button>
                  <Button
                    onClick={() => setIsCancelAuction(true)}
                    variant="flat"
                    className="w-full my-2">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {type == "inventory" && (
                  <div className="lg:justify-between lg:flex gap-x-3">
                    <Button
                      onClick={() => setIsCreateAuction(true)}
                      variant="flat"
                      color="primary"
                      className="w-full my-2">
                      Auction
                    </Button>
                    <Button
                      onClick={() => setIsListOpen(true)}
                      variant="flat"
                      color="primary"
                      className="w-full my-2">
                      List
                    </Button>
                  </div>
                )}
                {type == "listed" && (
                  <div>
                    <p className="text-default-500">
                      Price: {product?.price} MKC
                    </p>
                    <div className="lg:justify-between lg:flex gap-x-3">
                      <Button
                        onClick={() => setIsUpdate(true)}
                        variant="flat"
                        color="primary"
                        className="w-full my-2">
                        Update Price
                      </Button>

                      <Button
                        onClick={() => setIsUnlistOpen(true)}
                        variant="flat"
                        className="w-full my-2">
                        Unlist
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardFooter>
        </Card>
      </div>

      <ListProductModal
        isOpen={isListOpen}
        id={product?.id}
        title={product?.name}
        onClose={() => setIsListOpen(false)}
      />

      <CreateAuctionModal
        isOpen={isCreateAuction}
        id={product?.id}
        title={product?.name}
        onClose={() => setIsCreateAuction(false)}
      />

      <UnlistProductModal
        isOpen={isUnlistOpen}
        id={product?.id}
        title={product?.name}
        onClose={() => setIsUnlistOpen(false)}
      />

      <CancelAuctionModal
        isOpen={isCancelAuction}
        id={product?.id}
        onClose={() => setIsCancelAuction(false)}
      />

      <FinishAuctionModal
        isOpen={isFinishAuction}
        product={product}
        onClose={() => setIsFinishAuction(false)}
      />

      <UpdatePriceProductModal
        isOpen={isUpdate}
        id={product?.id}
        title={product?.name}
        onClose={() => setIsUpdate(false)}
      />
    </>
  );
}
