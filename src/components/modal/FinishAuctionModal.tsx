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
import AuctionContract from "@/contracts/AuctionContract";
import { useSession } from "next-auth/react";
import { getSigner } from "@/lib/hooks/getSigner";
import { useRouter } from "next/navigation";
import { IProductInfo } from "@/_types_";
import toast from "react-hot-toast";

interface IFinishAuctionModal {
  isOpen: boolean;
  product: IProductInfo;
  onClose: () => void;
}
const FinishAuctionModal: React.FC<IFinishAuctionModal> = ({
  isOpen,
  product,
  onClose,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  // redux
  const { onOpen } = useModal();
  const session = useSession();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!session?.data || !product) return;
    if (product?.endTime! < Date.now()) {
      toast.error("It's not yet time to end the auction");
      return;
    }
    if (session?.data?.user?.id == product?.lastBidder?.id) {
      toast.error(
        "This item has no bidders. You can only cancel the auction!!"
      );
      return;
    }
    const signer = await getSigner(session?.data?.user?.wallet);
    try {
      setIsLoading(true);
      const auctionContract = new AuctionContract(signer);
      const tx = await auctionContract.finishAuction(product?.id);
      await session.update({
        ...session?.data?.user,
        mkc: session?.data?.user?.mkc + product?.lastBid!,
      });
      onOpen("success", { hash: tx, title: "FINISH AUCTIONS" });
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
