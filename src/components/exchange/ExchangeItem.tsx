import React from "react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { showShorterString } from "@/utils";
import { useRouter } from "next/navigation";
interface IProductProps {
  name?: string;
  image: string;
  isCheck?: boolean;
  productId?: number;
  onClick?: () => void;
}

export default function ExchangeItem({
  name,
  image,
  isCheck,
  productId,
  onClick,
}: IProductProps) {
  const router = useRouter();
  return (
    <div
      onClick={onClick ? onClick : () => router.push(`/product/${productId}`)}>
      <Card
        shadow="sm"
        className={isCheck ? "border-1 border-sky-700 h-full" : "h-full"}>
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
          <div className="w-full">{showShorterString(name!, 20)}</div>
        </CardFooter>
      </Card>
    </div>
  );
}
