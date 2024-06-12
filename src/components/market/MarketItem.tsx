import React from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
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
}

export default function MarketItem({
  name,
  authorId,
  authorName,
  authorImage,
  image,
  price,
  productId,
}: IProductProps) {
  const router = useRouter();
  const [isBuyOpen, setIsBuyOpen] = React.useState<boolean>(false);
  const session = useSession();

  return (
    <>
      <div onClick={() => router.push(`/product/${productId}`)}>
        <Card shadow="sm" className="h-full">
          <Chip
            className="z-50 hover:cursor-pointer absolute left-1 top-1 text-center p-1 text-xs lg:text-sm"
            color="primary"
            variant="flat">
            ID: {productId}
          </Chip>
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
            <div className="text-xs md:text-sm md:grid md:grid-cols-2 py-3">
              <div className="text-gray-600">Author:</div>
              <div
                className="flex text-gray-600/75 hover:text-cyan-600 hover:cursor-pointer"
                onClick={() => router.push(`/account/${authorId}`)}>
                <Avatar
                  isFocusable
                  className="mr-2 w-5 h-5 my-2 md:my-0"
                  isBordered
                  alt="NextUI Fruit Image with Zoom"
                  src={authorImage}
                />
                <div className="hover:border-b-1 border-cyan-800 flex items-center">
                  {authorName}
                </div>
              </div>
            </div>

            <div className="lg:justify-between lg:flex lg:items-center">
              <p className="text-default-500">Price: {price} MKC</p>
              <Button
                variant="flat"
                color="primary"
                className="w-full lg:w-20"
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
