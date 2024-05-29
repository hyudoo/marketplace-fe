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
import ProductContract from "@/contracts/ProductContract";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getSigner } from "@/lib/hooks/getSigner";
import { IProductInfo } from "@/_types_";

interface IAcceptExchangeModal {
  isOpen: boolean;
  id: number;
  products: IProductInfo[];
  onClose: () => void;
}

const AcceptExchangeModal: React.FC<IAcceptExchangeModal> = ({
  isOpen,
  id,
  products,
  onClose,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const session = useSession();
  const router = useRouter();
  // redux
  const { onOpen } = useModal();
  const handleSubmit = async () => {
    if (!session?.data || !id || !products) return;
    try {
      const signer = await getSigner(session?.data?.user?.wallet);
      setIsLoading(true);
      const productContract = new ProductContract(signer);
      const exchangeContract = new ExchangeProductContract(signer);
      for (let product of products) {
        await productContract.approve(
          exchangeContract._contractAddress,
          product.id
        );
      }
      const tx = await exchangeContract.acceptTransaction(id);
      onOpen("success", { hash: tx, title: "ACCEPT EXCHANGE" });
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
          ACCEPT EXCHANGE
        </ModalHeader>
        <ModalBody>
          <div className="flex gap-x-1 text-sm items-center justify-center">
            You want to accept this exchange?
          </div>

          <Button
            fullWidth
            isLoading={isLoading}
            onClick={handleSubmit}
            color="primary"
            variant="flat"
            type="submit"
            className="mb-4">
            Accept
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AcceptExchangeModal;
