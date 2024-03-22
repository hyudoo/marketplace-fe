"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import { useModal } from "@/reduxs/use-modal-store";
import { useAppSelector, useAppDispatch } from "@/reduxs/hooks";

const ProcessingModal = () => {
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false);
  const { wallet, signer } = useAppSelector((state) => state.account);

  // redux
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "processing";
  const { onOpen, onOpenChange } = useDisclosure();

  return (
    <Modal
      backdrop="opaque"
      isOpen={isModalOpen}
      onOpenChange={onOpenChange}
      placement="center"
      className="overflow-y-auto"
      onClose={onClose}>
      <ModalContent>
        <ModalHeader className="justify-center text-large m-2">
          Your transaction is being processed
        </ModalHeader>
        <ModalBody>
          <Spinner size="lg" />
          <div className="flex text-sm text-slate-500 justify-center items-center">
            Waiting for the confirmation of your transaction
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProcessingModal;
