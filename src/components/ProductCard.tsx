import React from "react";
import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react";
interface IProductProps {
  name?: string;
  image: string;
  price?: number | string;
  onClick?: () => void;
  onList?: () => void;
}

export default function ProductCard({
  name,
  image,
  price,
  onClick,
  onList,
}: IProductProps) {
  return (
    <div onClick={onClick}>
      <Card shadow="sm">
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
        <CardFooter className="text-small justify-between">
          <b className="h-full w-full">{name}</b>
          {onList ? (
            <Button
              onClick={onList}
              variant="flat"
              color="primary"
              className="p-2 m-0">
              List
            </Button>
          ) : (
            <p className="text-default-500">{price} MKC</p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
