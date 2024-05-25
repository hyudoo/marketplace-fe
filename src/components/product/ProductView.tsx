"use client";
import React from "react";
import { IProductInfo, IUserInfo } from "@/_types_";
import TransitHistoryModal from "../modal/TransitHistoryModal";
import BuyProductModal from "../modal/BuyProductModal";
import UpdatePriceProductModal from "../modal/UpdatePriceProductModal";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Image,
  Divider,
  Avatar,
} from "@nextui-org/react";
import JoinActionModal from "../modal/JoinActionModal";
import { useRouter } from "next/navigation";
import { IoChevronBackOutline, IoChevronForward } from "react-icons/io5";
import { useSession } from "next-auth/react";
interface IProductViewProps {
  product: IProductInfo;
  transitHistory: IUserInfo[];
}
const ProductView: React.FC<IProductViewProps> = ({
  product,
  transitHistory,
}) => {
  const [index, setIndex] = React.useState<number>(0);
  const [mainImage, setMainImage] = React.useState<string>(
    product?.images?.[0]
  );
  const [slideImage, setSlideImage] = React.useState<string[]>(
    product?.images?.slice(0, 4)
  );
  const [isTransitOpen, setIsTransitOpen] = React.useState<boolean>(false);
  const [isBuyOpen, setIsBuyOpen] = React.useState<boolean>(false);
  const [isAuctionOpen, setIsAuctionOpen] = React.useState<boolean>(false);
  const [isUpdateOpen, setIsUpdateOpen] = React.useState<boolean>(false);
  const session = useSession();

  const router = useRouter();

  const handleNextImage = () => {
    if (!product || !product.images || product.images.length === 0) {
      return;
    }
    if (index + 4 < product?.images?.length) {
      let i = index + 1;
      setIndex(i);
      setSlideImage(product?.images?.slice(i, i + 4));
    }
  };

  const handlePreviousImage = () => {
    if (!product || !product.images || product.images.length === 0) {
      return;
    }
    if (index > 0) {
      let i = index - 1;
      setIndex(i);
      setSlideImage(product?.images?.slice(i, i + 4));
    }
  };

  return (
    <>
      <div className="md:grid md:grid-cols-3 space-x-2 p-2 w-full bg-white">
        <div>
          <Image
            width="100%"
            src={mainImage}
            fallbackSrc="https://via.placeholder.com/300x200"
            alt="NextUI Image with fallback"
          />
          <div className="relative py-2">
            <div className="absolute z-20 inset-y-2 -left-7">
              <Button
                isIconOnly
                aria-label="previos"
                color="primary"
                variant="light"
                className="h-full"
                onClick={handlePreviousImage}>
                <IoChevronBackOutline />
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {slideImage?.map((img, index) => (
                <Image
                  key={index}
                  className="w-full h-full object-cover"
                  src={img}
                  alt="NextUI Image with fallback"
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
            <div className="absolute z-10 inset-y-2 -right-7">
              <Button
                isIconOnly
                aria-label="next"
                color="primary"
                variant="light"
                className="h-full"
                onClick={handleNextImage}>
                <IoChevronForward />
              </Button>
            </div>
          </div>
        </div>
        <div className="col-span-2 pl-3">
          <Card className="w-full">
            <CardHeader className="justify-between">
              <div className="flex gap-5">
                <div className="flex flex-col gap-1 items-start justify-center">
                  <h2 className="font-semibold leading-none text-default-600">
                    {product?.name}
                  </h2>
                  <h5 className="text-small tracking-tight text-default-400">
                    Type: {product?.type}
                  </h5>
                </div>
              </div>
              <Button
                color="primary"
                radius="full"
                size="sm"
                onClick={() => setIsTransitOpen(true)}>
                Transit History
              </Button>
            </CardHeader>
            <Divider />
            <CardBody className="px-3 py-0 text-small text-default-400">
              <div className="text-xs md:text-sm grid grid-cols-3 items-center py-3">
                <div className="text-gray-600 font-semibold">Manufacturer:</div>
                <div
                  className="col-span-2 flex items-center text-gray-600/75 hover:text-cyan-600 hover:cursor-pointer"
                  onClick={() =>
                    router.push(`/account/${product?.manufacturer?.id}`)
                  }>
                  <Avatar
                    className="mr-3"
                    size="sm"
                    isFocusable
                    isBordered
                    alt="NextUI Fruit Image with Zoom"
                    src={product?.manufacturer?.avatar}
                  />
                  <div className="items-center hover:border-b-1 border-cyan-800">
                    {product?.manufacturer?.name || "Unnamed"}
                  </div>
                </div>
              </div>
              <Divider />

              <div className="text-xs md:text-sm grid grid-cols-3 items-center py-3">
                <div className="text-gray-600 font-semibold">Author:</div>
                <div
                  className="col-span-2 flex items-center text-gray-600/75 hover:text-cyan-600 hover:cursor-pointer"
                  onClick={() =>
                    router.push(`/account/${product?.author?.id}`)
                  }>
                  <Avatar
                    className="mr-3"
                    isFocusable
                    size="sm"
                    isBordered
                    alt="NextUI Fruit Image with Zoom"
                    src={product?.author?.avatar}
                  />
                  <div className="hover:border-b-1 items-center border-cyan-800">
                    {product?.author?.name || "Unnamed"}
                  </div>
                </div>
              </div>

              <Divider />
              {product?.price && (
                <div className="justify-between flex w-full py-2">
                  <p className="text-xs md:text-sm text-gray-600 font-semibold items-center flex">
                    Price: {product?.price} MKC
                  </p>
                  {product?.author?.id == session?.data?.user?.id ? (
                    <Button
                      color="primary"
                      radius="full"
                      size="sm"
                      onClick={() => setIsUpdateOpen(true)}>
                      Update Price
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      radius="full"
                      size="sm"
                      isDisabled={!session?.data}
                      onClick={() => setIsBuyOpen(true)}>
                      Buy Now
                    </Button>
                  )}
                </div>
              )}

              {product?.lastBid && (
                <div>
                  <div className="text-xs md:text-sm grid grid-cols-3 items-center py-3">
                    <div className="text-gray-600 font-semibold">
                      Last Bidder:
                    </div>
                    <div
                      className="col-span-2 flex items-center text-gray-600/75 hover:text-cyan-600 hover:cursor-pointer"
                      onClick={() =>
                        router.push(`/account/${product?.lastBidder?.id}`)
                      }>
                      <Avatar
                        className="mr-3"
                        isFocusable
                        size="sm"
                        isBordered
                        alt="NextUI Fruit Image with Zoom"
                        src={product?.lastBidder?.avatar}
                      />
                      <div className="hover:border-b-1 items-center border-cyan-800">
                        {product?.lastBidder?.name || "Unnamed"}
                      </div>
                    </div>
                  </div>
                  <Divider />
                  <div className="flex justify-between py-2">
                    <p className="text-xs md:text-sm text-gray-600 font-semibold items-center flex">
                      Bid: {product?.lastBid} MKC
                    </p>
                    <Button
                      className="items-center flex justify-center"
                      color="primary"
                      radius="full"
                      size="sm"
                      isDisabled={
                        !session ||
                        product?.lastBidder?.id == session?.data?.user?.id ||
                        product?.author?.id == session?.data?.user?.id
                      }
                      onClick={() => setIsAuctionOpen(true)}>
                      Join Auction
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>

            <Divider />
            <CardFooter className="gap-3 flex flex-col">
              <div className="text-xs md:text-sm w-full">
                <div className="text-gray-600 font-semibold">
                  Product Description:
                </div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: product?.description as string,
                  }}
                />
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      <TransitHistoryModal
        isOpen={isTransitOpen}
        history={transitHistory}
        title={product?.name!}
        onClose={() => setIsTransitOpen(false)}
      />

      <UpdatePriceProductModal
        isOpen={isUpdateOpen}
        title={product?.name!}
        id={product?.id}
        onClose={() => setIsUpdateOpen(false)}
      />

      <BuyProductModal
        isOpen={isBuyOpen}
        title={product?.name!}
        productId={product?.id}
        productPrice={product?.price!}
        onClose={() => setIsBuyOpen(false)}
      />

      <JoinActionModal
        isOpen={isAuctionOpen}
        onClose={() => setIsAuctionOpen(false)}
        id={product?.id}
        title={product?.name!}
      />
    </>
  );
};

export default ProductView;
