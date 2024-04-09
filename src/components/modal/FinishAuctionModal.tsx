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
import AuctionContract from "@/contracts/AuctionContract";
import { setUpdate } from "@/reduxs/accounts/account.slices";

interface IFinishAuctionModal {
  isOpen: boolean;
  id: number;
  render: () => void;
  onClose: () => void;
}

const FinishAuctionModal: React.FC<IFinishAuctionModal> = ({
  isOpen,
  id,
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
      const auctionContract = new AuctionContract(signer);
      const tx = await auctionContract.finishAuction(id);
      onOpen("success", { hash: tx, title: "ACCEPT EXCHANGE" });
      render();
      dispatch(setUpdate(true));
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
          FINISH AUCTION
        </ModalHeader>
        <ModalBody>
          <div className="flex gap-x-1 text-sm items-center justify-center">
            You want to finish this auction?
          </div>

          <Button
            fullWidth
            isLoading={isLoading}
            onClick={handleSubmit}
            color="primary"
            variant="flat"
            type="submit"
            className="mb-4">
            Finish
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FinishAuctionModal;
