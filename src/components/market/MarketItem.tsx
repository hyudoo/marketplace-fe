import React from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import BuyProductModal from "../modal/BuyProductModal";
import { useAppSelector } from "@/reduxs/hooks";
import ProfileContract from "@/contracts/ProfileContract";
import { IProfileInfo } from "@/_types_";
interface IProductProps {
  name?: string;
  author?: string;
  image: string;
  price?: number | string;
  productId?: number;
  render?: () => void;
}

export default function MarketItem({
  name,
  author,
  image,
  price,
  productId,
  render,
}: IProductProps) {
  const router = useRouter();
  const [isBuyOpen, setIsBuyOpen] = React.useState<boolean>(false);
  const { wallet } = useAppSelector((state) => state.account);
  const [authorProfile, setAuthorProfile] = React.useState<IProfileInfo>();
  React.useEffect(() => {
    const interval = setInterval(async () => {
      if (!author) return;
      const profileContract = new ProfileContract();
      const authorProfile = await profileContract.getProfileByAddress(author);

      setAuthorProfile(authorProfile);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [author]);

  return (
    <>
      <div onClick={() => router.push(`/product/${productId}`)}>
        <Card shadow="sm" className="h-full">
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
            <div className="text-xs md:text-sm grid grid-cols-3 items-center py-1">
              <div className="text-gray-600">Author:</div>
              <div className="col-span-2 flex items-center text-gray-600/75 hover:text-cyan-600 hover:cursor-pointer">
                <Avatar
                  isFocusable
                  className="w-6 h-6 mr-3 text-tiny"
                  isBordered
                  alt="NextUI Fruit Image with Zoom"
                  src={authorProfile?.avatar}
                />
                <div className="hover:border-b-1 items-center border-cyan-800">
                  {authorProfile?.name}
                </div>
              </div>
            </div>

            <div className="justify-between flex">
              <p className="text-default-500 flex items-center">
                Price: {price} MKC
              </p>
              <Button
                variant="flat"
                color="primary"
                className="p-2 m-0"
                disabled={!wallet || author == wallet?.address}
                onClick={() => setIsBuyOpen(true)}>
                Buy
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      <BuyProductModal
        isOpen={isBuyOpen}
        title={name!}
        productId={productId!}
        render={render!}
        productPrice={price as number}
        onClose={() => setIsBuyOpen(false)}
      />
    </>
  );
}
