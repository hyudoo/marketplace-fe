import React from "react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import SupplyChainContract from "@/contracts/SupplyChainContract";
import { IProductItem } from "@/_types_";

interface CardItemProps {
  productId?: number;
  image?: string;
  name?: string;
}
export default function CardItem({ productId, image, name }: CardItemProps) {
  const router = useRouter();

  return (
    <Card shadow="sm" onClick={() => router.push(`/product/${productId}`)}>
      <CardBody className="overflow-visible p-0">
        <Image
          shadow="sm"
          radius="lg"
          width="100%"
          height="100%"
          alt={name}
          className="object-fill cursor-pointer hover:scale-110 transition translate"
          src={image}
        />
      </CardBody>
      <CardFooter className="text-small">
        <b className="h-full w-full">{name}</b>
      </CardFooter>
    </Card>
  );
}
