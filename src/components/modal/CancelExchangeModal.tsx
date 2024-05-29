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
import ExchangeProductContract from "@/contracts/ExchangeProductContract";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getSigner } from "@/lib/hooks/getSigner";

interface ICancelExchangeModal {
  isOpen: boolean;
  id: number;
  onClose: () => void;
}

const CancelExchangeModal: React.FC<ICancelExchangeModal> = ({
  isOpen,
  id,
  onClose,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  // redux
  const { onOpen } = useModal();
  const router = useRouter();
  const session = useSession();
  const handleSubmit = async () => {
    if (!session?.data || !id) return;
    const signer = await getSigner(session?.data?.user?.wallet);
    try {
      setIsLoading(true);
      const marketContract = new ExchangeProductContract(signer);
      const tx = await marketContract.cancelTransaction(id);
      onOpen("success", { hash: tx, title: "CANCEL EXCHANGE" });
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
          CANCEL EXCHANGE
        </ModalHeader>
        <ModalBody>
          <div className="flex gap-x-1 text-sm items-center justify-center">
            You want to cancel this exchange?
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

export default CancelExchangeModal;
