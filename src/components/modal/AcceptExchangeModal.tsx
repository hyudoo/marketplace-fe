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
import SupplyChainContract from "@/contracts/SupplyChainContract";

interface IAcceptExchangeModal {
  isOpen: boolean;
  id: number;
  render: () => void;
  onClose: () => void;
}

const AcceptExchangeModal: React.FC<IAcceptExchangeModal> = ({
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
      const productContract = new SupplyChainContract(signer);
      const exchangeContract = new ExchangeProductContract(signer);
      const exchange = await exchangeContract.getTradeById(id);
      for (let id of exchange.receiverTokenIds!) {
        await productContract.approve(exchangeContract._contractAddress, id);
      }
      const tx = await exchangeContract.acceptTransaction(id);
      onOpen("success", { hash: tx, title: "ACCEPT EXCHANGE" });
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
