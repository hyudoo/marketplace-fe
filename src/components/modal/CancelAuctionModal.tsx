"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@nextui-org/react";
import React from "react";
import { useModal } from "@/lib/use-modal-store";
import AuctionContract from "@/contracts/AuctionContract";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getSigner } from "@/lib/hooks/getSigner";
import toast from "react-hot-toast";

interface ICancelAuctionModal {
  isOpen: boolean;
  id: number;
  onClose: () => void;
}

const CancelAuctionModal: React.FC<ICancelAuctionModal> = ({
  isOpen,
  id,
  onClose,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  // redux
  const router = useRouter();
  const session = useSession();
  const { onOpen } = useModal();
  const handleSubmit = async () => {
    if (!session?.data || !id) return;
    const signer = await getSigner(session?.data?.user?.wallet);
    try {
      setIsLoading(true);
      const auctioncontract = new AuctionContract(signer);
      const tx = await auctioncontract.cancelAuction(id);
      onOpen("success", { hash: tx, title: "CANCEL AUCTION" });
      router.refresh();
    } catch (error) {
      toast.error("Cancel Auction Failed.");
    } finally {
      onClose();
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
