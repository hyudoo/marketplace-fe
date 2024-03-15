import React from "react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";

interface IProductProps {
  name?: string;
  image: string;
  price?: number | string;
  onBuy?: () => void;
}

export default function ProductCard({
  name,
  image,
  price,
  onBuy,
}: IProductProps) {
  return (
    <Card shadow="sm" isPressable>
      <CardBody className="overflow-visible p-0">
        <Image
          shadow="sm"
          radius="lg"
          width="100%"
          alt={name}
          className="w-full object-cover h-[140px]"
          src={image}
        />
      </CardBody>
      <CardFooter className="text-small justify-between">
        <b>{name}</b>
        <p className="text-default-500">{price} MKC</p>
      </CardFooter>
    </Card>
  );
}
