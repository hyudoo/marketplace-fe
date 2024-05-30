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
import { useSession } from "next-auth/react";
interface IProductProps {
  name?: string;
  authorId?: string;
  authorName?: string;
  authorImage?: string;
  image: string;
  price?: number | string;
  productId?: number;
  render?: () => void;
}

export default function MarketItem({
  name,
  authorId,
  authorName,
  authorImage,
  image,
  price,
  productId,
  render,
}: IProductProps) {
  const router = useRouter();
  const [isBuyOpen, setIsBuyOpen] = React.useState<boolean>(false);
  const session = useSession();

  return (
    <>
      <div onClick={() => router.push(`/product/${productId}`)}>
        <Card shadow="sm" className="h-full">
          <CardBody className="overflow-visible flex flex-col">
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
            <div className="text-xs md:text-sm lg:flex lg:justify-between py-3">
              <div className="text-gray-600">Author:</div>
              <div
                className="flex text-gray-600/75 hover:text-cyan-600 hover:cursor-pointer"
                onClick={() => router.push(`/account/${authorId}`)}>
                <Avatar
                  isFocusable
                  className="mr-2 w-5 h-5"
                  isBordered
                  alt="NextUI Fruit Image with Zoom"
                  src={authorImage}
                />
                <div className="hover:border-b-1 border-cyan-800">
                  {authorName}
                </div>
              </div>
            </div>

            <div className="md:justify-between md:flex md:items-center">
              <p className="text-default-500">Price: {price} MKC</p>
              <Button
                variant="flat"
                color="primary"
                className="w-full md:w-20"
                disabled={!session?.data || session.data?.user.id == authorId}
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
        productPrice={price as number}
        onClose={() => setIsBuyOpen(false)}
      />
    </>
  );
}
