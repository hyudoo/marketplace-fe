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
import AuctionContract from "@/contracts/AuctionContract";

interface ICancelAuctionModal {
  isOpen: boolean;
  id: number;
  render: () => void;
  onClose: () => void;
}

const CancelAuctionModal: React.FC<ICancelAuctionModal> = ({
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
      const auctioncontract = new AuctionContract(signer);
      const tx = await auctioncontract.cancelAuction(id);
      onOpen("success", { hash: tx, title: "CANCEL AUCTION" });
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
          CANCEL AUCTION
        </ModalHeader>
        <ModalBody>
          <div className="flex gap-x-1 text-sm items-center justify-center">
            You want to cancel this auction?
          </div>

          <Button
            fullWidth
            isLoading={isLoading}
            onClick={handleSubmit}
            color="primary"
            variant="flat"
            type="submit"
            className="mb-4">
            Submit
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CancelAuctionModal;
