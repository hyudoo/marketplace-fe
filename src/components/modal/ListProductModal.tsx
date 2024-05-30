"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import React from "react";
import { useModal } from "@/lib/use-modal-store";
import ProductContract from "@/contracts/ProductContract";
import MarketPlaceContract from "@/contracts/MarketPlaceContract";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { getSigner } from "@/lib/hooks/getSigner";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface IListProductModal {
  isOpen: boolean;
  id: number;
  title: string;
  onClose: () => void;
}

const ListProductModal: React.FC<IListProductModal> = ({
  isOpen,
  id,
  title,
  onClose,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const session = useSession();
  const { onOpen } = useModal();
  const { handleSubmit, setValue } = useForm<FieldValues>({
    defaultValues: {
      price: 0,
    },
  });

  const { onOpenChange } = useDisclosure();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (data.price <= 0 || !id || !session?.data) return;
    const signer = await getSigner(session?.data?.user?.wallet);
    try {
      setIsLoading(true);
      const productContract = new ProductContract(signer);
      const marketContract = new MarketPlaceContract(signer);
      await productContract.approve(marketContract._contractAddress, id);
      const tx = await marketContract.listProduct(id, data.price);
      onOpen("success", { hash: tx, title: "LIST PRODUCT" });
      router.refresh();
    } catch (error) {
      toast.error("List product failed.");
    } finally {
      onClose();
      setIsLoading(false);
    }
  };
  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      className="overflow-y-auto"
      onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        <ModalContent>
          <ModalHeader className="justify-center text-large m-2 border-b-2">
            LIST PRODUCT
          </ModalHeader>
          <ModalBody>
            <div className="flex gap-x-1 text-sm items-center justify-center">
              You want to sell <div className="font-bold"> {title} </div> at a
              price
            </div>
            <Input
              type="number"
              variant={"bordered"}
              label="Price"
              isRequired
              placeholder="Enter your product price"
              onChange={(e) => setValue("price", e.target.value)}
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">MKC</span>
                </div>
              }
            />

            <Button
              fullWidth
              isLoading={isLoading}
              color="primary"
              variant="flat"
              type="submit"
              className="mb-4">
              List
            </Button>
          </ModalBody>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default ListProductModal;
