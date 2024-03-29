import React from "react";
import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useModal } from "@/reduxs/use-modal-store";
import ListProductModal from "../modal/ListProductModal";
import UnlistProductModal from "../modal/UnlistProductModal";
interface IProductProps {
  name?: string;
  image: string;
  price?: number | string;
  productId?: number;
  type?: "inventory" | "listed" | "unlist";
  isCheck?: boolean;
  render?: () => void;
  onClick?: () => void;
}

export default function ProductCard({
  name,
  image,
  price,
  productId,
  type,
  isCheck,
  render,
  onClick,
}: IProductProps) {
  const router = useRouter();
  const { onOpen } = useModal();
  const [isListOpen, setIsListOpen] = React.useState<boolean>(false);
  const [isUnlistOpen, setIsUnlistOpen] = React.useState<boolean>(false);

  return (
    <>
      <div
        onClick={
          onClick ? onClick : () => router.push(`/product/${productId}`)
        }>
        <Card shadow="sm" className={isCheck ? "border-1 border-sky-700" : ""}>
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
            {type == "listed" && (
              <p className="text-default-500">{price} MKC</p>
            )}
            {type == "inventory" && (
              <Button
                onClick={() => setIsListOpen(true)}
                variant="flat"
                color="primary"
                className="p-2 m-0">
                List
              </Button>
            )}
            {type == "unlist" && (
              <Button
                onClick={() => setIsUnlistOpen(true)}
                variant="flat"
                color="primary"
                className="p-2 m-0">
                Unlist
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <ListProductModal
        isOpen={isListOpen}
        id={productId!}
        title={name!}
        render={render!}
        onClose={() => setIsListOpen(false)}
      />
      <UnlistProductModal
        isOpen={isUnlistOpen}
        id={productId!}
        title={name!}
        render={render!}
        onClose={() => setIsUnlistOpen(false)}
      />
    </>
  );
}
