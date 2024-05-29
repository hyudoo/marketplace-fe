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
import { useModal } from "@/reduxs/use-modal-store";
import MarketPlaceContract from "@/contracts/MarketPlaceContract";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getSigner } from "@/lib/hooks/getSigner";

interface IUpdatePriceProductModal {
  isOpen: boolean;
  id: number;
  title: string;
  onClose: () => void;
}

const UpdatePriceProductModal: React.FC<IUpdatePriceProductModal> = ({
  isOpen,
  id,
  title,
  onClose,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { onOpen } = useModal();
  const router = useRouter();
  const session = useSession();
  const { handleSubmit, setValue } = useForm<FieldValues>({
    defaultValues: {
      price: 0,
    },
  });

  const { onOpenChange } = useDisclosure();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (data.price <= 0 || !session?.data || !id) return;
    const signer = await getSigner(session?.data?.user?.wallet);
    try {
      setIsLoading(true);
      const marketContract = new MarketPlaceContract(signer);
      const tx = await marketContract.updateListingProductPrice(id, data.price);
      onOpen("success", { hash: tx, title: "UPDATE PRICE LIST PRODUCT" });
      onClose();
      router.refresh();
    } catch (error) {
      console.log("handleListProduct -> error", error);
    } finally {
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
              You want to update the price of
              <div className="font-bold"> {title} </div>
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
              Update Price
            </Button>
          </ModalBody>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default UpdatePriceProductModal;
