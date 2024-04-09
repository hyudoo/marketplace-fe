"use client";
import React from "react";
import SupplyChainContract from "@/contracts/SupplyChainContract";
import { IProductItem } from "@/_types_";
import {
  getAuctionAddress,
  getMarketPlaceAddress,
} from "@/contracts/utils/getAddress";
import MarketContract from "@/contracts/MarketPlaceContract";
import { useAppSelector } from "@/reduxs/hooks";
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
} from "@nextui-org/react";
import AuctionContract from "@/contracts/AuctionContract";
import { showSortAddress } from "@/utils";
import JoinActionModal from "../modal/JoinActionModal";
interface IProductViewProps {
  productId: number;
}
const ProductView: React.FC<IProductViewProps> = ({ productId }) => {
  const [index, setIndex] = React.useState<number>(0);
  const [product, setProduct] = React.useState<IProductItem>();
  const [mainImage, setMainImage] = React.useState<string>();
  const [slideImage, setSlideImage] = React.useState<string[]>();
  const [canBuy, setCanBuy] = React.useState<boolean>(false);
  const [isTransitOpen, setIsTransitOpen] = React.useState<boolean>(false);
  const [isBuyOpen, setIsBuyOpen] = React.useState<boolean>(false);
  const [isAuctionOpen, setIsAuctionOpen] = React.useState<boolean>(false);
  const [isUpdateOpen, setIsUpdateOpen] = React.useState<boolean>(false);
  const { wallet } = useAppSelector((state) => state.account);
  const [canUpdatePrice, setCanUpdatePrice] = React.useState<boolean>(false);
  const [isAuction, setIsAuction] = React.useState<boolean>(false);
  const [auctionInfo, setAuctionInfo] = React.useState<any>();
  const getProductInfo = React.useCallback(async () => {
    try {
      const contract = new SupplyChainContract();
      const product = await contract.getProductInfoById(productId);
      setProduct(product);
      setMainImage(product?.images[0]);
      setSlideImage(product?.images.slice(0, 4));
      const res = await contract.ownerOf(productId);
      if (res === getMarketPlaceAddress()) {
        setCanBuy(true);
        const marketContract = new MarketContract();
        const item = await marketContract.getListedProductByID(productId);
        setProduct({
          ...product,
          price: item.price,
        });
      } else if (res === getAuctionAddress()) {
        setIsAuction(true);
        const auctionContract = new AuctionContract();
        const info = await auctionContract.getAuction(productId);
        setAuctionInfo(info);
      }

      if (product?.author == wallet?.address) {
        setCanUpdatePrice(true);
      }
    } catch (err) {
      console.log(err);
    }
  }, [productId, wallet?.address]);

  React.useEffect(() => {
    getProductInfo();
  }, [getProductInfo]);

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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5">
                  <path
                    fillRule="evenodd"
                    d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                    clipRule="evenodd"
                  />
                </svg>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5">
                  <path
                    fillRule="evenodd"
                    d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
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
              <div className="text-xs md:text-sm">
                <div className="text-gray-600 font-semibold">Manufacturer:</div>
                <div className="text-gray-600/75">{product?.manufacturer}</div>
              </div>
              <div className="text-xs md:text-sm">
                <div className="text-gray-600 font-semibold">Author:</div>
                <div className="text-sm text-gray-600/75">
                  {product?.author || product?.manufacturer}
                </div>
              </div>
              <Divider />
              {canBuy && (
                <div className="justify-between flex w-full py-2">
                  <p className="text-xs md:text-sm text-gray-600 font-semibold items-center flex">
                    Price: {product?.price} MKC
                  </p>
                  {canUpdatePrice ? (
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
                      isDisabled={!wallet}
                      onClick={() => setIsBuyOpen(true)}>
                      Buy Now
                    </Button>
                  )}
                </div>
              )}

              {isAuction && (
                <div className="justify-between flex w-full py-2">
                  <div>
                    <div className="text-xs md:text-sm">
                      <div className="text-gray-600 font-semibold">
                        Last Bidder:
                      </div>
                      <div className="text-gray-600/75">
                        {showSortAddress(auctionInfo?.lastBidder)}
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 font-semibold items-center flex">
                      Bid: {auctionInfo?.lastBid} MKC
                    </p>
                  </div>
                  <Button
                    color="primary"
                    radius="full"
                    size="sm"
                    isDisabled={
                      !wallet ||
                      auctionInfo?.lastBidder == wallet?.address ||
                      auctionInfo?.author == wallet?.address
                    }
                    onClick={() => setIsAuctionOpen(true)}>
                    Join Auction
                  </Button>
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
        id={productId}
        title={product?.name!}
        onClose={() => setIsTransitOpen(false)}
      />

      <UpdatePriceProductModal
        isOpen={isUpdateOpen}
        title={product?.name!}
        id={productId}
        onClose={() => setIsUpdateOpen(false)}
      />

      <BuyProductModal
        isOpen={isBuyOpen}
        title={product?.name!}
        productId={productId}
        productPrice={product?.price!}
        onClose={() => setIsBuyOpen(false)}
      />

      <JoinActionModal
        isOpen={isAuctionOpen}
        onClose={() => setIsAuctionOpen(false)}
        id={productId}
        title={product?.name!}
      />
    </>
  );
};

export default ProductView;
