"use client";
import React from "react";
import { Button, Chip, Image, image } from "@nextui-org/react";
import SupplyChainContract from "@/contracts/SupplyChainContract";
import { useModal } from "@/reduxs/use-modal-store";
import { ProductItem } from "@/_types_";
import { getMarketPlaceAddress } from "@/contracts/utils/getAddress";
import MarketContract from "@/contracts/MarketPlaceContract";
import { useAppSelector } from "@/reduxs/hooks";
import MarketCoinsContract from "@/contracts/MarketCoinsContract";

interface IProductViewProps {
  productId: number;
}
const ProductView: React.FC<IProductViewProps> = ({ productId }) => {
  const [index, setIndex] = React.useState(0);
  const [product, setProduct] = React.useState<ProductItem>();
  const [mainImage, setMainImage] = React.useState<string>();
  const [slideImage, setSlideImage] = React.useState<string[]>();
  const { onOpen } = useModal();
  const [canBuy, setCanBuy] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const { wallet, signer } = useAppSelector((state) => state.account);

  const getProductInfo = React.useCallback(async () => {
    try {
      const contract = new SupplyChainContract();
      const product = await contract.getProductInfo(productId);
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
    } catch (err) {
      console.log(err);
    }
  }, [productId]);

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

  const handleBuyProduct = async () => {
    try {
      if (!signer || !product || !product?.price) return;
      setIsLoading(true);
      const marketCoins = new MarketCoinsContract(signer);
      const marketContract = new MarketContract(signer);
      await marketCoins.approve(
        marketContract._contractAddress,
        product?.price
      );

      const tx = await marketContract.buyProduct(productId);
      onOpen("success", { hash: tx, title: "Buy Product" });
    } catch (err) {
      console.log("handleBuyProduct->error", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="md:grid md:grid-cols-3 space-x-2 p-2 w-full bg-white">
      <div>
        <Image
          width="100%"
          src={mainImage}
          fallbackSrc="https://via.placeholder.com/300x200"
          alt="NextUI Image with fallback"
        />
        <div className="relative py-2">
          <div className="absolute z-20 inset-y-2 left-0">
            <Button
              isIconOnly
              aria-label="previos"
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
          <div className="absolute z-10 inset-y-2 right-0">
            <Button
              isIconOnly
              aria-label="next"
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
              onClick={() =>
                onOpen("transitHistory", {
                  id: productId,
                  title: product?.name,
                })
              }>
              See also Transit History
            </Chip>
            {canBuy && (
              <div className="justify-between flex border-t-2 border-blue-600 pt-4">
                <p className="text-500">Price: {product?.price} MKC</p>
                <Button
                  variant="bordered"
                  color="primary"
                  isLoading={isLoading}
                  isDisabled={!wallet || isLoading}
                  onClick={handleBuyProduct}>
                  Buy Now
                </Button>
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
  );
};

export default ProductView;
