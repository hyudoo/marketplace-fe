"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@nextui-org/react";
import React from "react";
import { useModal } from "@/reduxs/use-modal-store";
import { useAppDispatch, useAppSelector } from "@/reduxs/hooks";
import MarketPlaceContract from "@/contracts/MarketPlaceContract";
import { setUpdate } from "@/reduxs/accounts/account.slices";

interface IUnlistProductModal {
  isOpen: boolean;
  id: number;
  title: string;
  render: () => void;
  onClose: () => void;
}

const UnlistProductModal: React.FC<IUnlistProductModal> = ({
  isOpen,
  id,
  title,
  render,
  onClose,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  // redux
  const { onOpen } = useModal();
  const { wallet, signer } = useAppSelector((state) => state.account);
  const dispatch = useAppDispatch();
  const handleSubmit = async () => {
    if (!signer || !wallet || !id || !render) return;
    try {
      setIsLoading(true);
      const marketContract = new MarketPlaceContract(signer);
      const tx = await marketContract.unlistProduct(id);
      onOpen("success", { hash: tx, title: "UNLIST PRODUCT" });
      dispatch(setUpdate(true));
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
      placement="center"
      className="overflow-y-auto"
      onClose={onClose}>
      <ModalContent>
        <ModalHeader className="justify-center text-large m-2 border-b-2">
          UNLIST PRODUCT
        </ModalHeader>
        <ModalBody>
          <div className="flex gap-x-1 text-sm items-center justify-center">
            You want to unlist <div className="font-bold"> {title} </div>
          </div>

          <Button
            fullWidth
            isLoading={isLoading}
            onClick={handleSubmit}
            color="primary"
            variant="flat"
            type="submit"
            className="mb-4">
            Unlist
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UnlistProductModal;
