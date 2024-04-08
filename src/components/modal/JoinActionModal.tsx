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
import { useAppSelector } from "@/reduxs/hooks";
import SupplyChainContract from "@/contracts/SupplyChainContract";
import MarketPlaceContract from "@/contracts/MarketPlaceContract";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import AuctionContract from "@/contracts/AuctionContract";

interface IJoinActionModal {
  isOpen: boolean;
  id: number;
  title: string;
  render: () => void;
  onClose: () => void;
}

const JoinActionModal: React.FC<IJoinActionModal> = ({
  isOpen,
  id,
  title,
  render,
  onClose,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { wallet, signer } = useAppSelector((state) => state.account);

  const { onOpen } = useModal();

  const { handleSubmit, setValue, watch } = useForm<FieldValues>({
    defaultValues: {
      price: 0,
    },
  });

  const { onOpenChange } = useDisclosure();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (data.price <= 0 || !signer || !wallet || !id || !render) return;
    try {
      setIsLoading(true);
      const productContract = new SupplyChainContract(signer);
      const auctionContract = new AuctionContract(signer);
      await productContract.approve(auctionContract._contractAddress, id);
      const tx = await auctionContract.joinAuction(id, data.price);
      onOpen("success", { hash: tx, title: "LIST PRODUCT" });
      render();
      onClose();
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
            JOIN AUCTION
          </ModalHeader>
          <ModalBody>
            <div className="flex gap-x-1 text-sm items-center justify-center">
              You want to join auction{" "}
              <div className="font-bold"> {title} </div> at price
            </div>
            <Input
              type="number"
              variant={"bordered"}
              label="Prices"
              isRequired
              placeholder="Enter your price"
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
              Join
            </Button>
          </ModalBody>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default JoinActionModal;
