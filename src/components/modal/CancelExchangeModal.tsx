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
import { useAppSelector } from "@/reduxs/hooks";
import ExchangeProductContract from "@/contracts/ExchangeProductContract";

interface ICancelExchangeModal {
  isOpen: boolean;
  id: number;
  render: () => void;
  onClose: () => void;
}

const CancelExchangeModal: React.FC<ICancelExchangeModal> = ({
  isOpen,
  id,
  render,
  onClose,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  // redux
  const { onOpen } = useModal();
  const { wallet, signer } = useAppSelector((state) => state.account);

  const handleSubmit = async () => {
    if (!signer || !wallet || !id || !render) return;
    try {
      setIsLoading(true);
      const marketContract = new ExchangeProductContract(signer);
      const tx = await marketContract.cancelTransaction(id);
      onOpen("success", { hash: tx, title: "CANCEL EXCHANGE" });
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
          CANCEL EXCHANGE
        </ModalHeader>
        <ModalBody>
          <div className="flex gap-x-1 text-sm items-center justify-center">
            You want to cabncel this exchange?
          </div>

          <Button
            fullWidth
            isLoading={isLoading}
            onClick={handleSubmit}
            color="primary"
            variant="flat"
            type="submit"
            className="mb-4">
            Cancel
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CancelExchangeModal;
