"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import React from "react";
import { useModal } from "@/reduxs/use-modal-store";
import { useAppSelector } from "@/reduxs/hooks";
import ExchangeProductContract from "@/contracts/ExchangeProductContract";
import SupplyChainContract from "@/contracts/SupplyChainContract";

const ExchangeModal = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  // redux
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const {
    address,
    senderIds,
    receiverIds,
    senderProductName,
    receiverProductName,
  } = data;
  const isModalOpen = isOpen && type === "exchange";
  const { wallet, signer } = useAppSelector((state) => state.account);

  const { onOpenChange } = useDisclosure();

  const handleSubmit = async () => {
    if (!signer || !wallet || !address || (!senderIds && !receiverIds)) return;
    try {
      setIsLoading(true);
      const productContract = new SupplyChainContract(signer);
      const exchangeContract = new ExchangeProductContract(signer);
      for (let id of senderIds!) {
        await productContract.approve(exchangeContract._contractAddress, id);
      }
      const tx = await exchangeContract.createTransaction(
        address,
        senderIds!,
        receiverIds!
      );
      onOpen("success", { hash: tx, title: "UNLIST PRODUCT" });
    } catch (error) {
      console.log("handleListProduct -> error", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal
      backdrop="blur"
      isOpen={isModalOpen}
      onOpenChange={onOpenChange}
      placement="center"
      className="overflow-y-auto"
      onClose={onClose}>
      <ModalContent>
        <ModalHeader className="justify-center text-large m-2 border-b-2">
          EXCHANGE PRODUCT
        </ModalHeader>
        <ModalBody>
          <div className="gap-x-1 text-sm items-center justify-center">
            You want to exchange
            <div className="font-bold"> {senderProductName?.toString()} </div>
            with
            <div className="font-bold"> {receiverProductName?.toString()} </div>
            from address
            <div className="font-bold"> {address} </div>
          </div>

          <Button
            fullWidth
            isLoading={isLoading}
            onClick={handleSubmit}
            color="primary"
            variant="flat"
            type="submit"
            className="mb-4">
            Exchange
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ExchangeModal;
