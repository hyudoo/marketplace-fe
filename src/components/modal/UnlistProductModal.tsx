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
import MarketPlaceContract from "@/contracts/MarketPlaceContract";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getSigner } from "@/lib/hooks/getSigner";
import toast from "react-hot-toast";

interface IUnlistProductModal {
  isOpen: boolean;
  id: number;
  title: string;
  onClose: () => void;
}

const UnlistProductModal: React.FC<IUnlistProductModal> = ({
  isOpen,
  id,
  title,
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
      const marketContract = new MarketPlaceContract(signer);
      const tx = await marketContract.unlistProduct(id);
      onOpen("success", { hash: tx, title: "UNLIST PRODUCT" });
      router.refresh();
    } catch (error) {
      toast.error("Unlist Product Failed!!!");
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
