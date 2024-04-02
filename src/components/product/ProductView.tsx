"use client";
import React from "react";
import { Button, Chip, Image } from "@nextui-org/react";
import SupplyChainContract from "@/contracts/SupplyChainContract";
import { IProductItem } from "@/_types_";
import { getMarketPlaceAddress } from "@/contracts/utils/getAddress";
import MarketContract from "@/contracts/MarketPlaceContract";
import { useAppSelector } from "@/reduxs/hooks";
import TransitHistoryModal from "../modal/TransitHistoryModal";
import BuyProductModal from "../modal/BuyProductModal";
import UpdatePriceProductModal from "../modal/UpdatePriceProductModal";

interface IProductViewProps {
  productId: number;
}
const ProductView: React.FC<IProductViewProps> = ({ productId }) => {
  const [index, setIndex] = React.useState(0);
  const [product, setProduct] = React.useState<IProductItem>();
  const [mainImage, setMainImage] = React.useState<string>();
  const [slideImage, setSlideImage] = React.useState<string[]>();
  const [canBuy, setCanBuy] = React.useState<boolean>(false);
  const [isTransitOpen, setIsTransitOpen] = React.useState<boolean>(false);
  const [isBuyOpen, setIsBuyOpen] = React.useState<boolean>(false);
  const [isUpdateOpen, setIsUpdateOpen] = React.useState<boolean>(false);
  const { wallet } = useAppSelector((state) => state.account);
  const [canUpdatePrice, setCanUpdatePrice] = React.useState<boolean>(false);
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
        const item = await marketContract.getListedProductByIDs(productId);
        setProduct({
          ...product,
          price: item.price,
        });
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
      setIndex(index + 1);
      setSlideImage(product?.images?.slice(index, index + 4));
    }
  };

  const handlePreviousImage = () => {
    if (!product || !product.images || product.images.length === 0) {
      return;
    }
    if (index > 0) {
      setIndex(index - 1);
      setSlideImage(product?.images?.slice(index, index + 4));
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
          <div className="text-xl font-bold p-2">Product Information:</div>
          <div className="p-4 border-2 mx-4 space-y-4 border-blue-400 rounded-xl">
            <div className="text-3xl font-bold">{product?.name}</div>
            <div className="text-sm mb-2 font-light text-gray-400 border-blue-400 border-b-2">
              Type: {product?.type}
            </div>
            <div className="space-y-2 text-lg">
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
              <Chip
                color="primary"
                variant="flat"
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => setIsTransitOpen(true)}>
                See also Transit History
              </Chip>
              {canBuy && (
                <div className="justify-between flex border-t-2 border-blue-600 pt-4">
                  <p className="text-500">Price: {product?.price} MKC</p>
                  {canUpdatePrice ? (
                    <Button
                      variant="bordered"
                      color="primary"
                      onClick={() => setIsUpdateOpen(true)}>
                      Update Price
                    </Button>
                  ) : (
                    <Button
                      variant="bordered"
                      color="primary"
                      isDisabled={!wallet}
                      onClick={() => setIsBuyOpen(true)}>
                      Buy Now
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="text-xl font-bold p-2">Product Description:</div>
          <div className="px-4 space-y-4">
            <div
              className="p-4 border-2 border-blue-400 rounded-xl"
              dangerouslySetInnerHTML={{
                __html: product?.description as string,
              }}
            />
          </div>
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
    </>
  );
};

export default ProductView;
